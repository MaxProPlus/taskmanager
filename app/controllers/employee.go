package controllers

import (
	"database/sql"
	"taskmanager/app/helpers"
	"taskmanager/app/models/entity"
	. "taskmanager/app/models/providers/Employee"
	. "taskmanager/app/systems/Auth"
	. "taskmanager/app/systems/Postgres"

	"github.com/revel/revel"
)

//Контроллер для сущности Employee
type CEmployee struct {
	*revel.Controller
	DB               *sql.DB
	employeeProvider EmployeeProvider
	authProvider     AuthProvider
}

func init() {
	revel.InterceptMethod((*CEmployee).iBefore, revel.BEFORE)
	revel.InterceptMethod((*CEmployee).iAfter, revel.AFTER)
}

//Интерсептор
func (c *CEmployee) iBefore() revel.Result {
	//подключение к бд
	postgresProvider := PostgresProvider{}
	c.DB = postgresProvider.Connect()

	user := entity.User{}

	var token string
	c.Session.GetInto("token", &token, false)

	c.authProvider = AuthProvider{DB: c.DB, User: &user}
	c.authProvider.Init()

	//проверка токена пользователя
	err := c.authProvider.CheckAuth()
	if err != nil {
		return c.RenderJSON(helpers.Failed(err))
	}

	//провайдер на сущность Employee
	c.employeeProvider = EmployeeProvider{DB: c.DB}
	c.employeeProvider.Init()
	return nil
}

//Интерсептор для отключения от БД
func (c *CEmployee) iAfter() revel.Result {
	c.DB.Close()
	return nil
}

//Метод для просмотре всех должностей
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
