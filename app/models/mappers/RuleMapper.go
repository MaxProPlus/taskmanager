package mappers

import (
	"database/sql"
	"errors"
)

type RuleMapper struct {
	DB *sql.DB
}

//Метод на проверку является ли сотрудник руководителем проекта по idEmployee и idProject
func (m *RuleMapper) IsLeader(idEmployee, idProject int) error {
	var check bool
	sql := `SELECT
		CASE WHEN COUNT(*)>0 THEN true ELSE false END
		FROM t_employee,t_project,t_group
		WHERE 
			t_employee.c_id=$1 AND
			t_project.c_id=$2 AND
			t_employee.c_id=t_group.fk_leader AND
			t_project.fk_group=t_group.c_id`
	row := m.DB.QueryRow(sql, idEmployee, idProject)
	err := row.Scan(&check)
	if err != nil {
		return err
	}
	if !check {
		return errors.New("Нет прав")
	}
	return nil
}

//Метод на проверку является ли сотрудник руководителем  idEmployee
func (m *RuleMapper) IsLeaderGroup(idEmployee int) error {
	var check bool
	sql := `SELECT
		CASE WHEN COUNT(*)>0 THEN true ELSE false END
		FROM t_employee,t_group
		WHERE 
			t_employee.c_id=$1 AND
			t_employee.c_id=t_group.fk_leader`
	row := m.DB.QueryRow(sql, idEmployee)
	err := row.Scan(&check)
	if err != nil {
		return err
	}
	if !check {
		return errors.New("Нет прав")
	}
	return nil
}
