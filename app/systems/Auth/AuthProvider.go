package Auth

import (
	"database/sql"
	"taskmanager/app/models/entity"
	"taskmanager/app/models/mappers"
)

//Провайдер на сущность Task
type AuthProvider struct {
	DB         *sql.DB
	authMapper *mappers.AuthMapper
	User       *entity.User
}

//Инициализация маппера
func (p *AuthProvider) Init() {
	p.authMapper = &mappers.AuthMapper{DB: p.DB}
	employee, _ := p.authMapper.SelectByToken(p.User)
	p.User.Employee = employee
}

func (p *AuthProvider) CheckAuth() error {
	err := p.authMapper.CheckAuth(p.User)
	if err != nil {
		return err
	}
	return nil
}

func (p *AuthProvider) CheckRulesCreateTask(e *entity.Project) error {
	err := p.authMapper.CheckEmployeeLeaderInProject(p.User.Employee,
		e)
	if err != nil {
		return err
	}
	return nil
}
