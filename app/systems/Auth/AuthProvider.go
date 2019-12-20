package Auth

import (
	"crypto/rand"
	"database/sql"
	"fmt"
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
	// employee, _ := p.authMapper.SelectByToken(p.User)
	// p.User.Employee = employee
}

func (p *AuthProvider) Login(e *entity.User) (*entity.User, error) {
	user, err := p.authMapper.Login(e)
	if err != nil {
		return nil, err
	}
	token := randToken()
	user.Token = token
	return user, nil
}

func randToken() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func (p *AuthProvider) Logout(token *string) error {
	err := p.authMapper.Logout(token)
	if err != nil {
		return err
	}
	return nil
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
