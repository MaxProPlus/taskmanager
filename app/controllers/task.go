package controllers

import (
	"database/sql"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	. "taskmanager/app/models/providers/Task"
	. "taskmanager/app/systems/Auth"
	. "taskmanager/app/systems/Postgres"

	"github.com/revel/revel"
)

//Контроллер для сущности Task
type CTask struct {
	*revel.Controller
	DB           *sql.DB
	taskProvider TaskProvider
	authProvider AuthProvider
}

//Интерсептор для подключение к БД
func (c *CTask) iBefore() revel.Result {
	postgresProvider := PostgresProvider{}
	c.DB = postgresProvider.Connect()

	user := entity.User{}
	c.Session.GetInto("token", &user.Token, false)
	c.authProvider = AuthProvider{DB: c.DB, User: &user}

	c.authProvider.Init()

	//проверка токена пользователя
	err := c.authProvider.CheckAuth()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	c.taskProvider = TaskProvider{DB: c.DB}
	c.taskProvider.Init()
	return nil
}

//Интерсептор для отключения от БД
func (c *CTask) iAfter() revel.Result {
	c.DB.Close()
	return nil
}

func init() {
	revel.InterceptMethod((*CTask).iBefore, revel.BEFORE)
	revel.InterceptMethod((*CTask).iAfter, revel.AFTER)
}

//Метод для просмотра всех задач
func (c *CTask) Index() revel.Result {
	var idProject int
	c.Params.Bind(&idProject, "idProject")
	projects, err := c.taskProvider.GetAll(idProject)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(projects))
}

//Метод для просмотра одной задачи
func (c *CTask) Show() revel.Result {
	var idTask int
	c.Params.Bind(&idTask, "idTask")

	task, err := c.taskProvider.GetById(idTask)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(task))
}

//Метод на добавление новой задачи
func (c *CTask) Store() revel.Result {
	var idProject int
	c.Params.Bind(&idProject, "idProject")
	task := entity.Task{Project: &entity.Project{}}
	c.Params.BindJSON(&task)
	task.Project.Id = idProject

	err := c.authProvider.CheckRulesCreateTask(task.Project)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	newTask, err := c.taskProvider.Add(&task)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newTask))
}

//Метод на обновление задачи
func (c *CTask) Update() revel.Result {
	var idProject int
	c.Params.Bind(&idProject, "idProject")
	task := entity.Task{}
	c.Params.BindJSON(&task)
	task.Project.Id = idProject

	newTask, err := c.taskProvider.Update(&task)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newTask))
}

//Метод на удаление задачи
func (c *CTask) Destroy() revel.Result {
	var idTask int
	c.Params.Bind(&idTask, "idTask")

	err := c.taskProvider.Delete(idTask)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(nil))
}
