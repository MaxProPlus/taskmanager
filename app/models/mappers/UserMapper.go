package mappers

import (
	"database/sql"
	"taskmanager/app/models/entity"
)

type UserMapper struct {
	DB *sql.DB
}

//Метод для просмотра всех пользователей
func (m *UserMapper) SelectAll() (*[]entity.User, error) {
	//срез сущностей пользователей
	users := []entity.User{}

	//sql запрос на всех пользователей
	sql := `SELECT c_id, c_login, c_password, c_isAdmin, fk_employee
		FROM t_user`
	rows, err := m.DB.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		user := entity.User{Employee: &entity.Employee{}}
		err := rows.Scan(
			&user.Id, &user.Login, &user.Password, &user.IsAdmin,
			&user.Employee.Id)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return &users, nil
}

//Метод для просмотра одного пользователя
func (m *UserMapper) SelectById(id int) (*entity.User, error) {
	//сущность пользователя
	user := entity.User{Employee: &entity.Employee{}}
	//sql запрос на пользователя
	sql := `SELECT c_id, c_login, c_password, c_isAdmin, fk_employee
		FROM t_user
		WHERE c_id=$1`
	row := m.DB.QueryRow(sql, id)
	err := row.Scan(
		&user.Id, &user.Login, &user.Password, &user.IsAdmin,
		&user.Employee.Id)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

//Метод на добавление нового пользователя
func (m *UserMapper) Insert(e *entity.User) (*int, error) {
	var id int
	//sql запрос на вставку пользователя
	sql := "INSERT INTO t_user(c_login,c_password,c_isAdmin,fk_employee) VALUES ($1,$2,$3,$4) RETURNING c_id"
	err := m.DB.QueryRow(sql,
		e.Login, e.Password, e.IsAdmin, e.Employee.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на обновление пользователя
func (m *UserMapper) Update(e *entity.User) error {
	//sql запрос на обновление пользователя
	sql := "UPDATE t_user SET c_login=$2, c_password=$3, c_isAdmin=$4, fk_employee=$5 where c_id = $1"
	_, err := m.DB.Exec(sql, e.Id, e.Login, e.Password, e.IsAdmin, e.Employee.Id)
	if err != nil {
		return err
	}
	return nil
}

//Метод на удаление пользователя
func (m *UserMapper) Delete(id int) error {
	sql := "DELETE FROM t_user WHERE c_id=$1"
	_, err := m.DB.Exec(sql, id)
	if err != nil {
		return err
	}
	return nil
}
