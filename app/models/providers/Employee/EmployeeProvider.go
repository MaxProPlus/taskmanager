package Employee

import (
	"taskmanager/app/models/mappers"
	"taskmanager/app/models/entity"
	"database/sql"
)

//Провайдер на сущность Employee
type EmployeeProvider struct {
	DB *sql.DB
	employeeMapper *mappers.EmployeeMapper
}

//Инициализация маппера
func (p *EmployeeProvider) Init() {
	p.employeeMapper = &mappers.EmployeeMapper{DB:p.DB}
}

func (p *EmployeeProvider) GetAllPosition() (*[]entity.Position, error) {
	positions, err := p.employeeMapper.SelectAllPosition()
	if err != nil {
		return nil, err
	}
	return positions, nil
}

//Метод для просмотра всех сотрудников
func (p *EmployeeProvider) GetAll() (*[]entity.Employee, error) {
	//получить всех сотрудников
	employees, err := p.employeeMapper.SelectAll()
	if err != nil {
		return nil, err
	}
	return employees, nil
}

//Метод для просмотра одного сотудника
func (p *EmployeeProvider) GetById(id int) (*entity.Employee, error) {
	//получить сотрудника по id
	employee, err := p.employeeMapper.SelectById(id)
	if err != nil {
		return nil, err
	}
	return employee, nil
}

//Метод на добавление нового сотрудника
func (p *EmployeeProvider) Add(e *entity.Employee) (*entity.Employee, error) {
	id, err := p.employeeMapper.Insert(e)
	if err != nil {
		return nil, err
	}
	newEmployee, err := p.employeeMapper.SelectById(*id)
	if err != nil {
		return nil, err
	}
	return newEmployee, nil
}

//Метод на обновление сотрудника
func (p *EmployeeProvider) Update(e *entity.Employee) (*entity.Employee, error) {
	err := p.employeeMapper.Update(e)
	if err != nil {
		return nil, err
	}
	newEmployee, err := p.employeeMapper.SelectById(e.Id)
	if err != nil {
		return nil, err
	}
	return newEmployee, nil
}

//Метод на удаление сотрудника
func (p *EmployeeProvider) Delete(id int) error {
	//получить сотрудника по id
	err := p.employeeMapper.Delete(id)
	return err
}
