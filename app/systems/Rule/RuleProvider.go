package Auth

import (
	"database/sql"
	"errors"
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

//Является ли сотрудник руководителем
func (p *RuleProvider) IsLeaderGroup() error {
	err := p.ruleMapper.IsLeaderGroup(p.User.Employee.Id)
	if err != nil {
		return err
	}
	return nil
}

//Является ли сотрудник руководителем в проекте
func (p *RuleProvider) IsLeader(idProject int) error {
	err := p.ruleMapper.IsLeader(p.User.Employee.Id, idProject)
	if err != nil {
		return err
	}
	return nil
}

//Проверка на администратора
func (p *RuleProvider) CheckIsAdmin() error {
	if !p.User.IsAdmin {
		return errors.New("Нет прав")
	}
	return nil
}
