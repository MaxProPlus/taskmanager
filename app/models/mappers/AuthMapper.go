package mappers

import (
	"database/sql"
	"errors"
	"taskmanager/app/models/entity"
)

type AuthMapper struct {
	DB *sql.DB
}

//Вернуть пользователю по логину и паролю
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
