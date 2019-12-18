package mappers

import (
	"database/sql"
	"taskmanager/app/models/entity"
)

type GroupMapper struct {
	DB *sql.DB
}

//Метод для просмотра все групп
func (m *GroupMapper) SelectAll() (*[]entity.Group, error) {
	//срез сущностей групп
	groups := []entity.Group{}

	//запрос на все группы
	sql := `SELECT t_group.c_id,t_group.c_name,t_employee.c_id,t_employee.c_firstname,t_employee.c_secondname,t_employee.c_middlename,t_ref_position.c_id,t_ref_position.c_name
		FROM t_group,t_employee,t_ref_position 
		WHERE t_group.fk_leader = t_employee.c_id AND t_employee.fk_position = t_ref_position.c_id`
	rows, err := m.DB.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		group := entity.Group{Leader: &entity.Employee{Position: &entity.Position{}}}
		err := rows.Scan(
			&group.Id, &group.Name,
			&group.Leader.Id, &group.Leader.Firstname,
			&group.Leader.Secondname, &group.Leader.Middlename,
			&group.Leader.Position.Id, &group.Leader.Position.Name)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}
	return &groups, nil
}

//Метод для просмотра одной группы
func (m *GroupMapper) SelectById(id int) (*entity.Group, error) {
	//сущность группа
	group := entity.Group{Leader: &entity.Employee{Position: &entity.Position{}}}
	//запрос на группу
	sql := `SELECT t_group.c_id,t_group.c_name,
		t_employee.c_id,t_employee.c_firstname,t_employee.c_secondname,t_employee.c_middlename,t_ref_position.c_id,t_ref_position.c_name
		FROM t_group,t_employee,t_ref_position
		WHERE t_group.c_id = $1 AND t_group.fk_leader = t_employee.c_id AND t_employee.fk_position = t_ref_position.c_id`
	row := m.DB.QueryRow(sql, id)
	err := row.Scan(
		&group.Id, &group.Name,
		&group.Leader.Id, &group.Leader.Firstname,
		&group.Leader.Secondname, &group.Leader.Middlename,
		&group.Leader.Position.Id, &group.Leader.Position.Name)
	if err != nil {
		return nil, err
	}
	return &group, nil
}

//Метод на добавление новой группы
func (m *GroupMapper) Insert(e *entity.Group) (*int, error) {
	var id int
	sql := "INSERT INTO t_group(c_name,fk_leader) VALUES ($1,$2) RETURNING c_id"
	err := m.DB.QueryRow(sql,
		e.Name, e.Leader.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на обновление группы в БД
func (m *GroupMapper) Update(e *entity.Group) error {
	sql := "UPDATE t_group SET c_name=$1, fk_leader=$2 where c_id = $3"
	_, err := m.DB.Exec(sql, e.Name, e.Leader.Id, e.Id)
	if err != nil {
		return err
	}
	return nil
}

//Метод на удаление группы
func (m *GroupMapper) Delete(id int) error {
	_, err := m.DB.Exec("DELETE FROM t_group WHERE c_id=$1", id)
	if err != nil {
		return err
	}
	return nil
}
