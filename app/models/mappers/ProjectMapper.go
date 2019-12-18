package mappers

import (
	"database/sql"
	"taskmanager/app/models/entity"
)

type ProjectMapper struct {
	DB *sql.DB
}

//Метод для просмотра всех проектов
func (m *ProjectMapper) SelectAll() (*[]entity.Project, error) {
	//срез сущностей проектов
	projects := []entity.Project{}

	//sql запрос на все проекты
	sql := `SELECT t_project.c_id,t_project.c_name, t_project.c_description,
		t_group.c_id,t_group.c_name,
		t_employee.c_id,t_employee.c_firstname,t_employee.c_secondname,t_employee.c_middlename,
		t_ref_position.c_id,t_ref_position.c_name
		FROM t_project,t_group,t_employee,t_ref_position
		WHERE t_project.fk_group = t_group.c_id AND t_group.fk_leader = t_employee.c_id AND t_employee.fk_position = t_ref_position.c_id`
	rows, err := m.DB.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		project := entity.Project{Group: &entity.Group{Leader: &entity.Employee{Position: &entity.Position{}}}}
		err := rows.Scan(
			&project.Id, &project.Name, &project.Description,
			&project.Group.Id, &project.Group.Name,
			&project.Group.Leader.Id, &project.Group.Leader.Firstname,
			&project.Group.Leader.Secondname, &project.Group.Leader.Middlename,
			&project.Group.Leader.Position.Id, &project.Group.Leader.Position.Name)
		if err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}
	return &projects, nil
}

//Метод для просмотра одного проекта
func (m *ProjectMapper) SelectById(id int) (*entity.Project, error) {
	//сущность проект
	project := entity.Project{Group: &entity.Group{Leader: &entity.Employee{Position: &entity.Position{}}}}
	//sql запрос на проект
	sql := `SELECT t_project.c_id,t_project.c_name, t_project.c_description,
		t_group.c_id,t_group.c_name,
		t_employee.c_id,t_employee.c_firstname,t_employee.c_secondname,t_employee.c_middlename,
		t_ref_position.c_id,t_ref_position.c_name
		FROM t_project,t_group,t_employee,t_ref_position
		WHERE t_project.c_id = $1 AND t_project.fk_group = t_group.c_id AND t_group.fk_leader = t_employee.c_id AND t_employee.fk_position = t_ref_position.c_id`
	row := m.DB.QueryRow(sql, id)
	err := row.Scan(
		&project.Id, &project.Name, &project.Description,
		&project.Group.Id, &project.Group.Name,
		&project.Group.Leader.Id, &project.Group.Leader.Firstname,
		&project.Group.Leader.Secondname, &project.Group.Leader.Middlename,
		&project.Group.Leader.Position.Id, &project.Group.Leader.Position.Name)
	if err != nil {
		return nil, err
	}
	return &project, nil
}

//Метод на добавление нового проекта
func (m *ProjectMapper) Insert(e *entity.Project) (*int, error) {
	var id int
	//sql запрос на вставку проекта
	sql := "INSERT INTO t_project(c_name,c_description,fk_group) VALUES ($1,$2,$3) RETURNING c_id"
	err := m.DB.QueryRow(sql,
		e.Name, e.Description, e.Group.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на обновление проекта
func (m *ProjectMapper) Update(e *entity.Project) error {
	//sql запрос на обновление проекта
	sql := "UPDATE t_project SET c_name=$2, c_description=$3, fk_group=$4 where c_id = $1"
	_, err := m.DB.Exec(sql, e.Id, e.Name, e.Description, e.Group.Id)
	if err != nil {
		return err
	}
	return nil
}

//Метод на удаление проекта
func (m *ProjectMapper) Delete(id int) error {
	sql := "DELETE FROM t_project WHERE c_id=$1"
	_, err := m.DB.Exec(sql, id)
	if err != nil {
		return err
	}
	return nil
}
