package controllers

import (
	"github.com/revel/revel"
	. "taskmanager/app/models/providers/Project"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	"database/sql"
	. "taskmanager/app/systems/Postgres"
)

//Контроллер для сущности Employee

type CProject struct {
	*revel.Controller
	DB *sql.DB
	projectProvider ProjectProvider
}

//Интерсептор для подключение к БД
func (c *CProject) Before() (revel.Result, *CProject) {
	postgresProvider := PostgresProvider{}
	c.DB = postgresProvider.Connect()
	c.projectProvider = ProjectProvider{DB: c.DB}
	c.projectProvider.Init()
	return nil, c
}

//Интерсептор для отключения от БД
func (c *CProject) After() (revel.Result, *CProject) {
	c.DB.Close()
	return nil, c
}

//Метод для просмотра всех проектов
func (c *CProject) Index() revel.Result{
	projects, err := c.projectProvider.GetAll()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(projects))
}

//Метод для просмотра одного проекта
func (c *CProject) Show() revel.Result{
	var idProject int
	c.Params.Bind(&idProject, "idProject")
	
	project, err := c.projectProvider.GetById(idProject)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(project))
}

//Метод на добавление нового проекта
func (c *CProject) Store() revel.Result {
	project := entity.Project{}
	c.Params.BindJSON(&project)
	newProject, err := c.projectProvider.Add(&project)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newProject))
}

//Метод на обновление проекта
func (c *CProject) Update() revel.Result {
	project := entity.Project{}
	c.Params.BindJSON(&project)

	newProject, err := c.projectProvider.Update(&project)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newProject))
}

//Метод на удаление проекта
func (c *CProject) Destroy() revel.Result {
	var idProject int
	c.Params.Bind(&idProject, "idProject")

	err := c.projectProvider.Delete(idProject)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(nil))
}