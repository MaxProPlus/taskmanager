package mappers

import (
	"database/sql"
	"errors"
	"taskmanager/app/models/entity"
)

type AuthMapper struct {
	DB *sql.DB
}

//Проверка на существование пользователя с логином и паролем
func (m *AuthMapper) Login(e *entity.User) (*entity.User, error) {
	user := entity.User{Employee: &entity.Employee{}}
	//sql запрос
	sql := `SELECT
		t_user.c_id, t_employee.c_id
		FROM t_user, t_employee
		WHERE t_user.c_login=$1 AND t_user.c_password=$2`
	row := m.DB.QueryRow(sql, e.Login, e.Password)
	err := row.Scan(&user.Id, &user.Employee.Id)
	if err != nil {
		return nil, errors.New("Неправильный логин или пароль")
	}
	return &user, nil
}

func (m *AuthMapper) CheckEmployeeLeaderInProject(emp *entity.Employee, proj *entity.Project) error {
	var count int
	sql := `SELECT COUNT(t_employee.c_id) FROM t_employee,t_project,t_group
		WHERE 
			t_employee.c_id=$1 AND
			t_project.c_id=$2 AND
			t_employee.c_id=t_group.fk_leader AND
			t_project.fk_group=t_group.c_id`
	row := m.DB.QueryRow(sql, emp.Id, proj.Id)
	err := row.Scan(&count)
	if err != nil {
		return err
	}
	if count != 1 {
		return errors.New("Нет прав")
	}
	return nil

}

//Вернуть сотрудника по id пользователя
// func (m *AuthMapper) SelectById(e *entity.User) (*entity.Employee, error) {
// 	employee := entity.Employee{}
// 	sql := `SELECT t_employee.c_id FROM t_user,t_employee
// 		WHERE t_user.c_token = $1 AND t_user.fk_employee = t_employee.c_id`
// 	row := m.DB.QueryRow(sql, e.Token)
// 	err := row.Scan(&employee.Id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return &employee, nil
// }

// func (m *AuthMapper) UpdateToken(e *entity.User) error {
// 	sql := `UPDATE t_user SET
// 		c_token = $1
// 		WHERE c_login = $2`
// 	_, err := m.DB.Exec(sql, e.Token, e.Login)
// 	if err != nil {
// 		return err
// 	}
// 	return nil
// }

// func (m *AuthMapper) CheckAuth(e *entity.User) error {
// 	var count int
// 	//sql запрос
// 	sql := `SELECT
// 		COUNT(c_id)
// 		FROM t_user
// 		WHERE c_token = $1`
// 	row := m.DB.QueryRow(sql, e.Token)
// 	err := row.Scan(&count)
// 	if err != nil {
// 		return err
// 	}
// 	if count != 1 {
// 		return errors.New("wrong token")
// 	}
// 	return nil
// }

// func (m *AuthMapper) Logout(token *string) error {
// 	sql := `UPDATE t_user SET
// 		c_token = NULL
// 		WHERE c_token = $1`
// 	_, err := m.DB.Exec(sql, token)
// 	if err != nil {
// 		return err
// 	}
// 	return nil
// }
