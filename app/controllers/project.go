package controllers

import (
	"fmt"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	. "taskmanager/app/models/providers/Project"
	. "taskmanager/app/systems/Link"
	. "taskmanager/app/systems/Rule"

	"github.com/revel/revel"
	"github.com/revel/revel/cache"
)

//Контроллер для сущности Employee

type CProject struct {
	*revel.Controller
	link            *Link
	projectProvider ProjectProvider
	ruleProvider    RuleProvider
}

//инициализация интерсепторов
func init() {
	revel.InterceptMethod((*CProject).iBefore, revel.BEFORE)
}

//Интерсептор для подключение к БД
func (c *CProject) iBefore() revel.Result {
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

	//провайдер на сущность Project
	c.projectProvider = ProjectProvider{DB: c.link.DB}
	c.projectProvider.Init()

	//Провайдер на проверку прав
	c.ruleProvider = RuleProvider{DB: c.link.DB, User: c.link.User}
	c.ruleProvider.Init()
	return nil
}

//Метод для просмотра всех проектов
func (c *CProject) Index() revel.Result {
	projects, err := c.projectProvider.GetAll()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(projects))
}

//Метод для просмотра одного проекта
func (c *CProject) Show() revel.Result {
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

	//Проверка прав
	err := c.ruleProvider.IsLeaderGroup()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

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

	var id int
	c.Params.Bind(&id, "idProject")

	project.Id = id

	//Проверка прав
	err := c.ruleProvider.IsLeaderGroup()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

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

	//Проверка прав
	err := c.ruleProvider.IsLeaderGroup()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	err = c.projectProvider.Delete(idProject)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(nil))
}
