package controllers

import (
	"database/sql"
	"taskmanager/app/models/entity"
	. "taskmanager/app/systems/Auth"
	. "taskmanager/app/systems/Postgres"

	"github.com/revel/revel"
)

type App struct {
	*revel.Controller
	DB           *sql.DB
	authProvider *AuthProvider
}

func init() {
	revel.InterceptMethod((*App).iBefore, revel.BEFORE)
	revel.InterceptMethod((*App).iAfter, revel.AFTER)
}

//Интерсептор
func (c *App) iBefore() revel.Result {
	//подключение к бд
	postgresProvider := PostgresProvider{}
	c.DB = postgresProvider.Connect()

	user := entity.User{}
	c.Session.GetInto("token", &user.Token, false)
	c.authProvider = &AuthProvider{DB: c.DB, User: &user}
	c.authProvider.Init()

	return nil
}

//Интерсептор для отключения от БД
func (c *App) iAfter() revel.Result {
	c.DB.Close()
	return nil
}

func (c *App) Index() revel.Result {
	//проверка токена пользователя
	err := c.authProvider.CheckAuth()
	if err != nil {
		return c.Redirect((*App).Login)
	}
	return c.Render()
}
func (c *App) Login() revel.Result {
	return c.Render()
}
func (c *App) Test() revel.Result {
	return c.Render()
}
