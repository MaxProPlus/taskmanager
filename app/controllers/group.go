package controllers

import (
	"fmt"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	. "taskmanager/app/models/providers/Group"
	. "taskmanager/app/systems/Link"

	"github.com/revel/revel"
	"github.com/revel/revel/cache"
)

//Контроллер для сущности Employee

type CGroup struct {
	*revel.Controller
	link          *Link
	groupProvider GroupProvider
}

//инициализация интерсепторов
func init() {
	revel.InterceptMethod((*CGroup).iBefore, revel.BEFORE)
}

//Интерсептор для подключение к БД
func (c *CGroup) iBefore() revel.Result {
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

	//провайдер на сущность Group
	c.groupProvider = GroupProvider{DB: c.link.DB}
	c.groupProvider.Init()
	return nil
}

//Метод для просмотра всех групп
func (c *CGroup) Index() revel.Result {
	groups, err := c.groupProvider.GetAll()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(groups))
}

//Метод для просмотра одной группы
func (c *CGroup) Show() revel.Result {
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
