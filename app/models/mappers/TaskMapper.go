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
		t_task.c_id, t_task.c_name, t_task.c_description, t_task.c_hours,
		t_ref_task_type.c_id, t_ref_task_type.c_name,
		t_ref_task_status.c_id, t_ref_task_status.c_name,
		a.c_id, a.c_secondname, a.c_firstname, a.c_middlename,
		t_task.fk_perfomer
		FROM t_task
		INNER JOIN t_ref_task_type ON t_ref_task_type.c_id=t_task.fk_type
		INNER JOIN t_ref_task_status ON t_ref_task_status.c_id=t_task.fk_status
		INNER JOIN t_employee a ON a.c_id=t_task.fk_author
		INNER JOIN t_project ON t_project.c_id=t_task.fk_project
		WHERE fk_project=$1 AND t_task.fk_parent IS NULL`
	rows, err := m.DB.Query(sql, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		task := entity.Task{Project: &entity.Project{}, Author: &entity.Employee{}, Type: &entity.TaskType{}, Status: &entity.TaskStatus{}}
		// perfomer := entity.Employee{}
		var idPerfomer *int
		err := rows.Scan(
			&task.Id, &task.Name, &task.Description, &task.Hours,
			&task.Type.Id, &task.Type.Name,
			&task.Status.Id, &task.Status.Name,
			&task.Author.Id, &task.Author.Secondname, &task.Author.Firstname, &task.Author.Middlename,
			&idPerfomer)
		if err != nil {
			return nil, err
		}
		if idPerfomer != nil {
			task.Perfomer = &entity.Employee{Id: *idPerfomer}
		}

		tasks = append(tasks, task)
	}
	return &tasks, nil
}

//Метод для просмотра всех типов задач
func (m *TaskMapper) SelectAllType() (*[]entity.TaskType, error) {
	sql := `SELECT c_id, c_name FROM t_ref_task_type`
	rows, err := m.DB.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	task_types := []entity.TaskType{}
	for rows.Next() {
		task_type := entity.TaskType{}
		err := rows.Scan(&task_type.Id, &task_type.Name)
		if err != nil {
			return nil, err
		}
		task_types = append(task_types, task_type)
	}
	return &task_types, nil
}

//Метод для просмотра всех статусов задач
func (m *TaskMapper) SelectAllStatus() (*[]entity.TaskStatus, error) {
	sql := `SELECT c_id, c_name FROM t_ref_task_status`
	rows, err := m.DB.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	task_statuses := []entity.TaskStatus{}
	for rows.Next() {
		task_status := entity.TaskStatus{}
		err := rows.Scan(&task_status.Id, &task_status.Name)
		if err != nil {
			return nil, err
		}
		task_statuses = append(task_statuses, task_status)
	}
	return &task_statuses, nil
}

//Метод для просмотра одной задачи
func (m *TaskMapper) SelectById(id int) (*entity.Task, error) {
	//сущность задачи
	task := entity.Task{Project: &entity.Project{}, Author: &entity.Employee{}, Type: &entity.TaskType{}, Status: &entity.TaskStatus{}}
	var idPerfomer *int
	//sql запрос на задачу
	sql := `SELECT
		t_task.c_id,t_task.c_name,t_task.c_description,t_task.c_hours,t_task.fk_perfomer,
		t_ref_task_status.c_id,t_ref_task_status.c_name,
		t_ref_task_type.c_id,t_ref_task_type.c_name,
		a.c_id,a.c_firstname,a.c_secondname,a.c_middlename
		FROM t_task
		INNER JOIN t_ref_task_status ON t_ref_task_status.c_id=t_task.fk_status
		INNER JOIN t_ref_task_type ON t_ref_task_type.c_id=t_task.fk_type
		INNER JOIN t_employee a ON a.c_id=t_task.fk_author
		WHERE t_task.c_id = $1`
	row := m.DB.QueryRow(sql, id)
	err := row.Scan(
		&task.Id, &task.Name, &task.Description, &task.Hours, &idPerfomer,
		&task.Status.Id, &task.Status.Name,
		&task.Type.Id, &task.Type.Name,
		// &task.Perfomer.Id, &task.Perfomer.Firstname, &task.Perfomer.Secondname,
		&task.Author.Id, &task.Author.Firstname, &task.Author.Secondname, &task.Author.Middlename)

	if idPerfomer != nil {
		task.Perfomer = &entity.Employee{Id: *idPerfomer}
	}

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

//Метод на добавление новой корневой задачи с исполнителем
func (m *TaskMapper) InsertRootWithPerfomer(e *entity.Task) (*int, error) {
	var id int
	//sql запрос на вставку задачи
	sql := `INSERT INTO t_task(
		c_name, c_description, c_hours, fk_status, fk_type, fk_project, fk_perfomer, fk_author) 
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING c_id`
	err := m.DB.QueryRow(sql,
		e.Name, e.Description, e.Hours, e.Status.Id, e.Type.Id, e.Project.Id, e.Perfomer.Id, e.Author.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на добавление новой корневой задачи без исполнителя
func (m *TaskMapper) InsertRootWithoutPerfomer(e *entity.Task) (*int, error) {
	var id int
	//sql запрос на вставку задачи
	sql := `INSERT INTO t_task(
		c_name, c_description, c_hours, fk_status, fk_type, fk_project, fk_author) 
		VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING c_id`
	err := m.DB.QueryRow(sql,
		e.Name, e.Description, e.Hours, e.Status.Id, e.Type.Id, e.Project.Id, e.Author.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на добавление новой задачи c родителем с исполнителем
func (m *TaskMapper) InsertChildWithPerfomer(e *entity.Task) (*int, error) {
	var id int
	//sql запрос на вставку задачи
	sql := `INSERT INTO t_task(
		c_name, c_description, c_hours, fk_status, fk_type, fk_project, fk_perfomer, fk_author, fk_parent) 
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING c_id`
	err := m.DB.QueryRow(sql,
		e.Name, e.Description, e.Hours, e.Status.Id, e.Type.Id, e.Project.Id, e.Perfomer.Id, e.Author.Id, e.Parent.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на добавление новой задачи c родителем без исполнителя
func (m *TaskMapper) InsertChildWithoutPerfomer(e *entity.Task) (*int, error) {
	var id int
	//sql запрос на вставку задачи
	sql := `INSERT INTO t_task(
		c_name, c_description, c_hours, fk_status, fk_type, fk_project, fk_author, fk_parent) 
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING c_id`
	err := m.DB.QueryRow(sql,
		e.Name, e.Description, e.Hours, e.Status.Id, e.Type.Id, e.Project.Id, e.Author.Id, e.Parent.Id).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

//Метод на обновление задачи с исполнителем
func (m *TaskMapper) UpdateWithPerfomer(e *entity.Task) error {
	//sql запрос на обновление задачи
	sql := `UPDATE t_task SET 
		c_name=$2, c_description=$3, c_hours=$4,
		fk_status=$5,fk_type=$6, fk_perfomer=$7
		WHERE c_id = $1`
	_, err := m.DB.Exec(sql,
		e.Id, e.Name, e.Description, e.Hours, e.Status.Id, e.Type.Id, e.Perfomer.Id)
	if err != nil {
		return err
	}
	return nil
}

//Метод на обновление задачи без исполнителя
func (m *TaskMapper) UpdateWithoutPerfomer(e *entity.Task) error {
	//sql запрос на обновление задачи
	sql := `UPDATE t_task SET 
		c_name=$2, c_description=$3, c_hours=$4,
		fk_status=$5,fk_type=$6, fk_perfomer=null
		WHERE c_id = $1`
	_, err := m.DB.Exec(sql,
		e.Id, e.Name, e.Description, e.Hours, e.Status.Id, e.Type.Id)
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
