package controllers

import (
	"fmt"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	. "taskmanager/app/models/providers/Task"
	. "taskmanager/app/systems/Auth"
	. "taskmanager/app/systems/Link"

	"github.com/revel/revel"
	"github.com/revel/revel/cache"
)

//Контроллер для сущности Task
type CTask struct {
	*revel.Controller
	link         *Link
	taskProvider TaskProvider
	authProvider AuthProvider
}

//инициализация интерсепторов
func init() {
	revel.InterceptMethod((*CTask).iBefore, revel.BEFORE)
}

//Интерсептор для подключение к БД
func (c *CTask) iBefore() revel.Result {
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

	//провайдер на сущность Task
	c.taskProvider = TaskProvider{DB: c.link.DB}
	c.taskProvider.Init()
	return nil
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
