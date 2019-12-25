package controllers

import (
	"database/sql"
	"fmt"

	// . "taskmanager/app/systems/Auth"
	. "taskmanager/app/systems/Link"
	// . "taskmanager/app/systems/Postgres"

	"github.com/revel/revel"
	"github.com/revel/revel/cache"
)

type App struct {
	*revel.Controller
	DB *sql.DB
}

//Главная страница
func (c *App) Index() revel.Result {
	//Достать токен пользователя
	token, err := c.Session.Get("token")
	if err != nil {
		return c.Redirect((*App).Login)
	}

	//Достать подключеник к бд из кеша
	var link *Link
	if err := cache.Get("link_"+fmt.Sprintf("%v", token),
		&link); err != nil {
		return c.Redirect((*App).Login)
	}
	return c.Render()
}

//Страница входа
func (c *App) Login() revel.Result {
	return c.Render()
}

//Страница для тестирования, удалить после
func (c *App) Test() revel.Result {

	// c.Session["test"] = "test"

	// var token string
	// _, err := c.Session.GetInto("test", &token, false)
	// if err != nil {
	// 	return c.RenderText("token error")
	// }

	// return c.RenderText(token)

	// employeeNew := entity.Employee{
	// 	Id: 1, Firstname: "hh",
	// 	Secondname: "ff", Middlename: "ff",
	// 	Position: &entity.Position{Id: 1, Name: "gg"}}
	// go cache.Set("test", employeeNew, 30*time.Minute)

	// var employee entity.Employee
	// err := cache.Get("test", &employee)
	// if err != nil {
	// 	return c.RenderError(err)
	// }
	// //return c.RenderJSON(c.Session)
	// return c.RenderText(employee.Firstname)
	return c.Render()
}

//Страница для тестирования, удалить после
func (c *App) Test1() revel.Result {
	// c.Session["test"] = "test"

	// var token string
	// _, err := c.Session.GetInto("test", &token, false)
	test, err := c.Session.Get("token")
	if err != nil {
		return c.RenderText("token error")
	}

	return c.RenderText(fmt.Sprintf("%v", test))
}
