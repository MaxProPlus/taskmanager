package Auth

import (
	"taskmanager/app/models/mappers"
	"taskmanager/app/models/entity"
	"database/sql"
	"fmt"
	"crypto/rand"
)

//Провайдер на сущность Task
type AuthProvider struct {
	DB *sql.DB
	authMapper *mappers.AuthMapper
}

//Инициализация маппера
func (p *AuthProvider) Init() {
	p.authMapper = &mappers.AuthMapper{DB:p.DB}
}

func (p *AuthProvider) Login(e *entity.User) (*string, error) {
	err := p.authMapper.Login(e)
	if err != nil {
		return nil, err
	}
	token := randToken()
	e.Token = token
	err = p.authMapper.UpdateToken(e)
	if err != nil {
		return nil, err
	}
	return &token, nil
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
