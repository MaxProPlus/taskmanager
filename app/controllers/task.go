package controllers

import (
	"fmt"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	. "taskmanager/app/models/providers/Task"
	. "taskmanager/app/systems/Link"
	. "taskmanager/app/systems/Rule"

	"github.com/revel/revel"
	"github.com/revel/revel/cache"
)

//Контроллер для сущности Task
type CTask struct {
	*revel.Controller
	link         *Link
	taskProvider TaskProvider
	ruleProvider RuleProvider
}

//инициализация интерсепторов
func init() {
	revel.InterceptMethod((*CTask).iBefore, revel.BEFORE)
}

//Интерсептор для проверки авторизации и взятие ссылки бд
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

	//Провайдер на проверку прав
	c.ruleProvider = RuleProvider{DB: c.link.DB, User: c.link.User}
	c.ruleProvider.Init()

	//провайдер на сущность Task
	c.taskProvider = TaskProvider{DB: c.link.DB}
	c.taskProvider.Init()
	return nil
}

//Метод для просмотра всех задач
func (c *CTask) Index() revel.Result {
	//Взять передаваемые значения
	var idProject int
	c.Params.Bind(&idProject, "idProject")

	//Запрос на просмотр
	tasks, err := c.taskProvider.GetAll(idProject)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(tasks))
}

//Метод на получение типов задач
func (c *CTask) IndexType() revel.Result {
	types, err := c.taskProvider.GetAllType()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(types))
}

//Метод на получение статусов задач
func (c *CTask) IndexStatus() revel.Result {
	status, err := c.taskProvider.GetAllStatus()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(status))
}

//Метод для просмотра одной задачи
func (c *CTask) Show() revel.Result {
	//Взять передаваемые значения
	var idTask int
	c.Params.Bind(&idTask, "idTask")

	//Запрос на задачу
	task, err := c.taskProvider.GetById(idTask)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(task))
}

//Метод на добавление новой задачи
func (c *CTask) Store() revel.Result {
	//Взять передаваемые значения
	var idProject int
	c.Params.Bind(&idProject, "idProject")
	task := entity.Task{Project: &entity.Project{}, Author: &entity.Employee{}}
	c.Params.BindJSON(&task)
	task.Project.Id = idProject
	task.Author.Id = c.link.User.Employee.Id

	//Проверка прав
	err := c.ruleProvider.IsLeader(idProject)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	//Выполнить добавление
	newTask, err := c.taskProvider.Add(&task)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newTask))
}

//Метод на обновление задачи
func (c *CTask) Update() revel.Result {
	//Взять передаваемые значения
	var idProject int
	c.Params.Bind(&idProject, "idProject")
	var idTask int
	c.Params.Bind(&idTask, "idTask")
	task := entity.Task{}
	c.Params.BindJSON(&task)
	task.Id = idTask
	task.Project.Id = idProject

	//Проверка прав
	err := c.ruleProvider.IsLeader(idProject)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	//Выполнить обновление
	newTask, err := c.taskProvider.Update(&task)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newTask))
}

//Метод на удаление задачи
func (c *CTask) Destroy() revel.Result {
	//Взять передаваемые значения
	var idTask int
	c.Params.Bind(&idTask, "idTask")
	var idProject int
	c.Params.Bind(&idProject, "idProject")

	//Проверка прав
	err := c.ruleProvider.IsLeader(idProject)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	//Выполнить удаление
	err = c.taskProvider.Delete(idTask)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(nil))
}
