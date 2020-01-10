package mappers

import (
	"database/sql"
	"taskmanager/app/models/entity"
)

type EmployeeMapper struct {
	DB *sql.DB
}

//Метод для просмотра всех должностей
func (m *EmployeeMapper) SelectAllPosition() (*[]entity.Position, error) {
	positions := []entity.Position{}
	sql := "SELECT c_id, c_name FROM t_ref_position"
	rows, err := m.DB.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		position := entity.Position{}
		err := rows.Scan(&position.Id, &position.Name)
		if err != nil {
			return nil, err
		}
		positions = append(positions, position)
	}
	return &positions, nil
}

//Метод для просмотра всех сотрудников
func (m *EmployeeMapper) SelectAll() (*[]entity.Employee, error) {
	//срез сущностей сотрудников
	employees := []entity.Employee{}

	//запрос на всех сотрудников
	sql := `SELECT t_employee.c_id,t_employee.c_firstname,t_employee.c_secondname,t_employee.c_middlename,t_ref_position.c_id,t_ref_position.c_name 
		FROM t_employee, t_ref_position 
		WHERE t_employee.fk_position = t_ref_position.c_id`
	rows, err := m.DB.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		emp := entity.Employee{Position: &entity.Position{}}
		err := rows.Scan(
			&emp.Id, &emp.Firstname,
			&emp.Secondname, &emp.Middlename, &emp.Position.Id, &emp.Position.Name)
		if err != nil {
			return nil, err
		}
		employees = append(employees, emp)
	}
	return &employees, nil
}

//Метод для просмотра одного сотудника
func (m *EmployeeMapper) SelectById(id int) (*entity.Employee, error) {
	//сущность сотрудник
	employee := entity.Employee{Position: &entity.Position{}}
	//запрос на сотрудника
	sql := `SELECT t_employee.c_id,t_employee.c_firstname,t_employee.c_secondname,t_employee.c_middlename,t_ref_position.c_id,t_ref_position.c_name 
		FROM t_employee, t_ref_position 
		WHERE t_employee.c_id = $1 AND t_employee.fk_position = t_ref_position.c_id`
	row := m.DB.QueryRow(sql, id)
	err := row.Scan(
		&employee.Id, &employee.Firstname,
		&employee.Secondname, &employee.Middlename, &employee.Position.Id, &employee.Position.Name)
	if err != nil {
		return nil, err
	}
	return &employee, nil
}

//Метод на добавление нового сотрудника
func (m *EmployeeMapper) Insert(e *entity.Employee) (*int, error) {
	var id int
	sql := "INSERT INTO t_employee(c_firstname, c_secondname, c_middlename, fk_position) VALUES ($1,$2,$3,$4) RETURNING c_id"
	err := m.DB.QueryRow(sql,
		e.Firstname, e.Secondname, e.Middlename, e.Position.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на обновление сотрудника в БД
func (m *EmployeeMapper) Update(e *entity.Employee) error {
	sql := "UPDATE t_employee SET c_firstname=$1, c_secondname=$2, c_middlename=$3, fk_position=$4 where c_id = $5"
	_, err := m.DB.Exec(sql, e.Firstname, e.Secondname, e.Middlename, e.Position.Id, e.Id)
	if err != nil {
		return err
	}
	return nil
}

//Метод на удаление сотрудника
func (m *EmployeeMapper) Delete(id int) error {
	sql := "DELETE FROM t_employee WHERE c_id=$1"
	_, err := m.DB.Exec(sql, id)
	if err != nil {
		return err
	}
	return nil
}
