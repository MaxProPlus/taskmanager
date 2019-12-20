package controllers

import (
	"database/sql"
	"taskmanager/app/models/entity"

	// . "taskmanager/app/systems/Auth"
	. "taskmanager/app/systems/Link"
	// . "taskmanager/app/systems/Postgres"
	"time"

	"github.com/revel/revel"
	"github.com/revel/revel/cache"
)

type App struct {
	*revel.Controller
	DB *sql.DB
	// authProvider *AuthProvider
}

//Главная страница
func (c *App) Index() revel.Result {

	//Проверка токена пользователя
	var link Link
	_, err := c.Session.GetInto("link", &link, false)
	if err != nil {
		return c.Redirect((*App).Login)
	}

	// return c.RenderText(token)

	// if err := cache.Get(token, &link); err != nil {
	// 	return c.Redirect((*App).Login)
	// }
	return c.Render()
}
func (c *App) Login() revel.Result {
	return c.Render()
}
func (c *App) Test() revel.Result {

	employeeNew := entity.Employee{
		Id: 1, Firstname: "hh",
		Secondname: "ff", Middlename: "ff",
		Position: &entity.Position{Id: 1, Name: "gg"}}
	go cache.Set("test", employeeNew, 30*time.Minute)

	var employee entity.Employee
	err := cache.Get("test", &employee)
	if err != nil {
		return c.RenderError(err)
	}
	//return c.RenderJSON(c.Session)
	return c.RenderText(employee.Firstname)
	//return c.Render()
}
