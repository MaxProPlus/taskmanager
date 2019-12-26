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