package controllers

import (
	"github.com/revel/revel"
	. "taskmanager/app/models/providers/Auth"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	"database/sql"
	. "taskmanager/app/systems/Postgres"
)

//Контроллер для сущности Task
type CAuth struct {
	*revel.Controller
	DB *sql.DB
	authProvider AuthProvider
}

//Интерсептор для подключение к БД
func (c *CAuth) Before() (revel.Result, *CAuth) {
	postgresProvider := PostgresProvider{}
	c.DB = postgresProvider.Connect()
	c.authProvider = AuthProvider{DB: c.DB}
	c.authProvider.Init()
	return nil, c
}

//Интерсептор для отключения от БД
func (c *CAuth) After() (revel.Result, *CAuth) {
	c.DB.Close()
	return nil, c
}

func (c *CAuth) Login() revel.Result {
	user := entity.User{}
	c.Params.BindJSON(&user)

	
	token, err := c.authProvider.Login(&user)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	c.Session["token"] = token
	return c.RenderJSON(helpers.Success(token))
}

func (c *CAuth) Logout() revel.Result {
	var token string
	c.Session.GetInto("token", &token, false)
	err := c.authProvider.Logout(&token)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	delete(c.Session, "token")
	return c.RenderJSON(helpers.Success(1))
}