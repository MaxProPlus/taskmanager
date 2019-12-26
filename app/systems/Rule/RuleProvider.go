package Auth

import (
	"database/sql"
	"taskmanager/app/models/entity"
	"taskmanager/app/models/mappers"
)

//Провайдер на сущность Task
type RuleProvider struct {
	DB         *sql.DB
	ruleMapper *mappers.RuleMapper
	User       *entity.User
}

//Инициализация маппера
func (p *RuleProvider) Init() {
	p.ruleMapper = &mappers.RuleMapper{DB: p.DB}
}

//Может ли сотрудник создать задачу
func (p *RuleProvider) CheckRulesCreateTask(e *entity.Project) error {
	err := p.ruleMapper.CheckEmployeeLeaderInProject(p.User.Employee,
		e)
	if err != nil {
		return err
	}
	return nil
}

//Может ли сотрудник изменить задачу
func (p *RuleProvider) CheckRulesUpdateTask(e *entity.Project) error {
	//todo
	return nil
}

//Может ли сотрудник удалить задачу
func (p *RuleProvider) CheckRulesDeleteTask(e *entity.Project) error {
	//todo
	return nil
}
