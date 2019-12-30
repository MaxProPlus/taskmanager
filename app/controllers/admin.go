package controllers

import (
	"fmt"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	. "taskmanager/app/models/providers/User"
	. "taskmanager/app/systems/Link"
	. "taskmanager/app/systems/Rule"

	"github.com/revel/revel"
	"github.com/revel/revel/cache"
)

//Контроллер для сущности Employee
type CAdmin struct {
	*revel.Controller
	link         *Link
	userProvider UserProvider
	ruleProvider RuleProvider
}

//инициализация интерсепторов
func init() {
	revel.InterceptMethod((*CAdmin).iBefore, revel.BEFORE)
}

//Интерсептор для подлкючения к БД
func (c *CAdmin) iBefore() revel.Result {
	//Достать токен пользователя
	token, err := c.Session.Get("token")
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	//Достать подключеник к бд из кеша
	if err := cache.Get("link_"+fmt.Sprintf("%v", token),
		&c.link); err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	//Провайдер на проверку прав
	c.ruleProvider = RuleProvider{DB: c.link.DB, User: c.link.User}
	c.ruleProvider.Init()

	//Проверка прав
	if err := c.ruleProvider.CheckIsAdmin(); err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	//провайдер на сущность User
	c.userProvider = UserProvider{DB: c.link.DB}
	c.userProvider.Init()

	return nil
}

//Метод для просмотра всех пользователей
func (c *CAdmin) Index() revel.Result {
	users, err := c.userProvider.GetAll()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(users))
}

//Метод для просмотра одного пользователя
func (c *CAdmin) Show() revel.Result {
	var idUser int
	c.Params.Bind(&idUser, "idUser")

	user, err := c.userProvider.GetById(idUser)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(user))
}

//Метод на добавление нового пользователя
func (c *CAdmin) Store() revel.Result {
	user := entity.User{}
	c.Params.BindJSON(&user)

	newUser, err := c.userProvider.Add(&user)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newUser))
}

//Метод на обновление пользователя
func (c *CAdmin) Update() revel.Result {
	user := entity.User{}
	c.Params.BindJSON(&user)

	newUser, err := c.userProvider.Update(&user)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newUser))
}

//Метод на удаление пользователя
func (c *CAdmin) Destroy() revel.Result {
	var idUser int
	c.Params.Bind(&idUser, "idUser")

	err := c.userProvider.Delete(idUser)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(nil))
}
