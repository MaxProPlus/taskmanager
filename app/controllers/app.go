package controllers

import (
	"database/sql"
	"fmt"
	. "taskmanager/app/systems/Link"
	. "taskmanager/app/systems/Rule"

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

//Страница админки
func (c *App) Admin() revel.Result {
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

	//Проверить права
	ruleProvider := RuleProvider{DB: link.DB, User: link.User}
	ruleProvider.Init()
	if err := ruleProvider.CheckIsAdmin(); err != nil {
		return c.Redirect((*App).Index)
	}
	
	return c.Render()
}

//Страница входа
func (c *App) Login() revel.Result {
	return c.Render()
}