package mappers

import (
	"database/sql"
	"errors"
	"taskmanager/app/models/entity"
)

type RuleMapper struct {
	DB *sql.DB
}

func (m *RuleMapper) CheckEmployeeLeaderInProject(emp *entity.Employee, proj *entity.Project) error {
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
