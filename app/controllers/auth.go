package controllers

import (
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
	//Принять передаваемые значения
	reqUser := entity.User{}
	c.Params.BindJSON(&reqUser)

	//Подключение к БД
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

	//Сохранить подключение к БД в кеш
	link := Link{User: user, DB: db}
	go cache.Set(user.Token, &link, 120*time.Minute)

	return c.RenderJSON(helpers.Success(0))
}

func (c *CAuth) Logout() revel.Result {
	var token string
	_, err := c.Session.GetInto("token", &token, false)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	// 	err := c.authProvider.Logout(&token)
	// 	if err != nil {
	// 		return c.RenderJSON(helpers.Failed(err))
	// 	}

	var link Link
	if err := cache.Get(token, &link); err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	link.DB.Close()
	go cache.Delete(token)
	delete(c.Session, "token")
	return c.RenderJSON(helpers.Success(0))
}
