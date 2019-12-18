package controllers

import (
	"github.com/revel/revel"
)

type App struct {
	*revel.Controller
}

func (c *App) Index() revel.Result {
	return c.Render()
}
func (c *App) Login() revel.Result {
	return c.Render()
}
func (c *App) Profile() revel.Result {
	return c.Render()
}
func (c *App) Test() revel.Result {
	return c.Render()
}
