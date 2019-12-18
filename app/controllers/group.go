package controllers

import (
	"github.com/revel/revel"
	. "taskmanager/app/models/providers/Group"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	"database/sql"
	. "taskmanager/app/systems/Postgres"
)

//Контроллер для сущности Employee

type CGroup struct {
	*revel.Controller
	DB *sql.DB
	groupProvider GroupProvider
}

//Интерсептор для подключение к БД
func (c *CGroup) Before() (revel.Result, *CGroup) {
	postgresProvider := PostgresProvider{}
	c.DB = postgresProvider.Connect()
	c.groupProvider = GroupProvider{DB: c.DB}
	c.groupProvider.Init()
	return nil, c
}

//Интерсептор для отключения от БД
func (c *CGroup) After() (revel.Result, *CGroup) {
	c.DB.Close()
	return nil, c
}

//Метод для просмотра все групп
func (c *CGroup) Index() revel.Result{
	groups, err := c.groupProvider.GetAll()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(groups))
}

//Метод для просмотра одной группы
func (c *CGroup) Show() revel.Result{
	var idGroup int
	c.Params.Bind(&idGroup, "idGroup")
	
	group, err := c.groupProvider.GetById(idGroup)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(group))
}

//Метод на добавление новой группы
func (c *CGroup) Store() revel.Result {
	group := entity.Group{}
	c.Params.BindJSON(&group)
	newGroup, err := c.groupProvider.Add(&group)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newGroup))
}

//Метод на обновление группы в БД
func (c *CGroup) Update() revel.Result {
	group := entity.Group{}
	c.Params.BindJSON(&group)

	newGroup, err := c.groupProvider.Update(&group)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newGroup))
}

//Метод на удаление группы
func (c *CGroup) Destroy() revel.Result {
	var idGroup int
	c.Params.Bind(&idGroup, "idGroup")

	err := c.groupProvider.Delete(idGroup)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(nil))
}