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
}

//Проверить на правильность логин, пароль и вернуть id сотрудника
func (p *AuthProvider) Login(e *entity.User) (*entity.User, error) {
	user, err := p.authMapper.Login(e)
	if err != nil {
		return nil, err
	}
	token := randToken()
	user.Token = token
	return user, nil
}

//Сгенерировать рандомный токен
func randToken() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

//Может ли пользователь создать задачу
func (p *AuthProvider) CheckRulesCreateTask(e *entity.Project) error {
	err := p.authMapper.CheckEmployeeLeaderInProject(p.User.Employee,
		e)
	if err != nil {
		return err
	}
	return nil
}

//Может ли сотрудник изменить задачу
func (p *AuthProvider) CheckRulesUpdateTask(e *entity.Project) error {
	//todo
	return nil
}

//Может ли сотрудник удалить задачу
func (p *AuthProvider) CheckRulesDeleteTask(e *entity.Project) error {
	//todo
	return nil
}

//func (p *AuthProvider) CheckAuth() error {
	// 	err := p.authMapper.CheckAuth(p.User)
	// 	if err != nil {
	// 		return err
	// 	}
	// 	return nil
	// }
