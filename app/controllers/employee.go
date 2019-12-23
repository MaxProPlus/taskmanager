package controllers

import (
	"fmt"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	. "taskmanager/app/models/providers/Employee"
	. "taskmanager/app/systems/Auth"
	. "taskmanager/app/systems/Link"

	"github.com/revel/revel"
	"github.com/revel/revel/cache"
)

//Контроллер для сущности Employee
type CEmployee struct {
	*revel.Controller
	link             *Link
	employeeProvider EmployeeProvider
	authProvider     AuthProvider
}

//инициализация интерсепторов
func init() {
	revel.InterceptMethod((*CEmployee).iBefore, revel.BEFORE)
}

//Интерсептор для подлкючения к БД
func (c *CEmployee) iBefore() revel.Result {
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

	//провайдер на сущность Employee
	c.employeeProvider = EmployeeProvider{DB: c.link.DB}
	c.employeeProvider.Init()
	return nil
}

//Метод для просмотра всех должностей
func (c *CEmployee) IndexPosition() revel.Result {
	positions, err := c.employeeProvider.GetAllPosition()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(positions))
}

//Метод для просмотра всех сотрудников
func (c *CEmployee) Index() revel.Result {
	employees, err := c.employeeProvider.GetAll()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(employees))
}

//Метод для просмотра одного сотудника
func (c *CEmployee) Show() revel.Result {
	var idEmployee int
	c.Params.Bind(&idEmployee, "idEmployee")

	employee, err := c.employeeProvider.GetById(idEmployee)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(employee))
}

//Метод на добавление нового сотрудника
func (c *CEmployee) Store() revel.Result {
	employee := entity.Employee{}
	c.Params.BindJSON(&employee)
	newEmployee, err := c.employeeProvider.Add(&employee)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newEmployee))
}

//Метод на обновление сотрудника в БД
func (c *CEmployee) Update() revel.Result {
	employee := entity.Employee{}
	c.Params.BindJSON(&employee)

	var id int
	c.Params.Bind(&id, "idEmployee")
	employee.Id = id

	newEmployee, err := c.employeeProvider.Update(&employee)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(newEmployee))
}

//Метод на удаление сотрудника
func (c *CEmployee) Destroy() revel.Result {
	var idEmployee int
	c.Params.Bind(&idEmployee, "idEmployee")

	err := c.employeeProvider.Delete(idEmployee)
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}
	return c.RenderJSON(helpers.Success(nil))
}
