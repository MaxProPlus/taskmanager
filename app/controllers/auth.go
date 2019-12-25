package controllers

import (
	"fmt"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	. "taskmanager/app/systems/Auth"
	"time"

	. "taskmanager/app/systems/Link"
	. "taskmanager/app/systems/Postgres"

	"github.com/revel/revel"
	"github.com/revel/revel/cache"
)

//Контроллер для сущности Task
type CAuth struct {
	*revel.Controller
}

//Метод на аутентификацию
func (c *CAuth) Login() revel.Result {
	//Принять логин и пароль
	reqUser := entity.User{}
	c.Params.BindJSON(&reqUser)

	//Подключиться к БД
	postgresProvider := PostgresProvider{}
	db := postgresProvider.Connect()

	//Провайдер на аутентификацию
	authProvider := AuthProvider{DB: db}
	authProvider.Init()

	//Войти в систему
	user, err := authProvider.Login(&reqUser)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	//Сохранить токен в сессию
	c.Session["token"] = user.Token

	//Сохранить подключение к БД в кеше
	link := Link{User: user, DB: db}
	go cache.Set("link_"+user.Token, &link, 120*time.Minute)

	return c.RenderJSON(helpers.Success(0))
}

func (c *CAuth) Logout() revel.Result {
	//Получить токен пользователя
	token, err := c.Session.Get("token")
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	//Получить ссылку на подключение к бд из кеша
	var link *Link
	if err := cache.Get("link_"+fmt.Sprintf("%v", token), &link); err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	//Закрыть соединение
	link.DB.Close()
	//Удалить кеш и сессии связанные с пользователем
	go cache.Delete("link_" + fmt.Sprintf("%v", token))
	delete(c.Session, "token")

	return c.RenderJSON(helpers.Success(0))
}
