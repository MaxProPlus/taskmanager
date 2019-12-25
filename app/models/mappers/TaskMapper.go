package mappers

import (
	"database/sql"
	"taskmanager/app/models/entity"
)

type TaskMapper struct {
	DB *sql.DB
}

//Метод для просмотра всех задач
func (m *TaskMapper) SelectAll(id int) (*[]entity.Task, error) {
	//срез сущностей задач
	tasks := []entity.Task{}

	//sql запрос на все задачи
	sql := `SELECT
		t_task.c_id,t_task.c_name,t_task.c_description,t_task.c_hours,
		t_ref_task_type.c_id,t_ref_task_type.c_name,
		t_project.c_id,t_project.c_name,
		a.c_id,a.c_firstname,a.c_secondname
		FROM t_task
		INNER JOIN t_ref_task_type ON t_ref_task_type.c_id=t_task.fk_type
		INNER JOIN t_project ON t_project.c_id=t_task.fk_project
		INNER JOIN t_employee a ON a.c_id=t_task.fk_author
		WHERE t_project.c_id=$1 AND t_task.fk_parent IS NULL`
	rows, err := m.DB.Query(sql, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		task := entity.Task{Project: &entity.Project{}, Perfomer: &entity.Employee{}, Author: &entity.Employee{}, Type: &entity.TaskType{}, Status: &entity.TaskStatus{}}
		err := rows.Scan(
			&task.Id, &task.Name, &task.Description, &task.Hours,
			&task.Type.Id, &task.Type.Name,
			&task.Project.Id, &task.Project.Name,
			&task.Author.Id, &task.Author.Firstname, &task.Author.Secondname)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return &tasks, nil
}

//Метод для просмотра одной задачи
func (m *TaskMapper) SelectById(id int) (*entity.Task, error) {
	//сущность задачи
	task := entity.Task{Project: &entity.Project{}, Perfomer: &entity.Employee{}, Author: &entity.Employee{}}
	//sql запрос на задачу
	sql := `SELECT
		t_task.c_id,t_task.c_name,t_task.c_description,t_task.c_status,t_task.c_hours,
		t_ref_task_type.c_id,t_ref_task_type.c_name,
		t_project.c_id,t_project.c_name,
		p.c_id,p.c_firstname,p.c_secondname,
		a.c_id,a.c_firstname,a.c_secondname
		FROM t_task
		INNER JOIN t_ref_task_type ON t_ref_task_type.c_id=t_task.fk_type
		INNER JOIN t_project ON t_project.c_id=t_task.fk_project
		INNER JOIN t_employee p ON p.c_id=t_task.fk_perfomer
		INNER JOIN t_employee a ON a.c_id=t_task.fk_author
		WHERE t_task.c_id = $1`
	row := m.DB.QueryRow(sql, id)
	err := row.Scan(
		&task.Id, &task.Name, &task.Description, &task.Status, &task.Hours,
		&task.Type.Id, &task.Type.Name,
		&task.Project.Id, &task.Project.Name,
		&task.Perfomer.Id, &task.Perfomer.Firstname, &task.Perfomer.Secondname,
		&task.Author.Id, &task.Author.Firstname, &task.Author.Secondname)
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (m *TaskMapper) SelectWhereParent(id int) (*[]entity.Task, error) {
	tasks := []entity.Task{}
	sql := `SELECT
		c_id,c_name
		FROM t_task
		WHERE fk_parent=$1`
	rows, err := m.DB.Query(sql, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		task := entity.Task{}
		err := rows.Scan(&task.Id, &task.Name)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return &tasks, nil
}

//Метод на добавление новой корневой
func (m *TaskMapper) InsertRoot(e *entity.Task) (*int, error) {
	var id int
	//sql запрос на вставку задачи
	sql := `INSERT INTO t_task(
		c_name, c_description, c_status, c_hours, fk_type, fk_project, fk_perfomer, fk_author) 
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING c_id`
	err := m.DB.QueryRow(sql,
		e.Name, e.Description, e.Status, e.Hours, e.Type.Id, e.Project.Id, e.Perfomer.Id, e.Author.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на добавление новой задачи c родителем
func (m *TaskMapper) InsertChild(e *entity.Task) (*int, error) {
	var id int
	//sql запрос на вставку задачи
	sql := `INSERT INTO t_task(
		c_name, c_description, c_status, c_hours, fk_type, fk_project, fk_perfomer, fk_author, fk_parent) 
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING c_id`
	err := m.DB.QueryRow(sql,
		e.Name, e.Description, e.Status, e.Hours, e.Type.Id, e.Project.Id, e.Perfomer.Id, e.Author.Id, e.Parent.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на обновление задачи
func (m *TaskMapper) Update(e *entity.Task) error {
	//sql запрос на обновление задачи
	sql := `UPDATE t_task SET 
		c_name=$2, c_description=$3, c_status=$4, c_hours=$5,
		fk_type=$6,fk_project=$7,fk_perfomer=$8,fk_author=$9
		WHERE c_id = $1`
	_, err := m.DB.Exec(sql,
		e.Id, e.Name, e.Description, e.Status, e.Hours, e.Type.Id, e.Project.Id, e.Perfomer.Id, e.Author.Id)
	if err != nil {
		return err
	}
	return nil
}

//Метод на удаление задачи
func (m *TaskMapper) Delete(id int) error {
	//sql запрос на удаление задачи
	sql := "DELETE FROM t_task WHERE c_id=$1"
	_, err := m.DB.Exec(sql, id)
	if err != nil {
		return err
	}
	return nil
}
