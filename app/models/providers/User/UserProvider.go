package User

import (
	"database/sql"
	"taskmanager/app/models/entity"
	"taskmanager/app/models/mappers"
)

//Провайдер на сущность User
type UserProvider struct {
	DB         *sql.DB
	userMapper *mappers.UserMapper
}

//Инициализация маппера
func (p *UserProvider) Init() {
	p.userMapper = &mappers.UserMapper{DB: p.DB}
}

//Метод для просмотра всех пользователей
func (p *UserProvider) GetAll() (*[]entity.User, error) {
	users, err := p.userMapper.SelectAll()
	if err != nil {
		return nil, err
	}
	return users, nil
}

//Метод для просмотра одного пользователя
func (p *UserProvider) GetById(id int) (*entity.User, error) {
	user, err := p.userMapper.SelectById(id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

//Метод на добавление нового пользователя
func (p *UserProvider) Add(e *entity.User) (*entity.User, error) {
	id, err := p.userMapper.Insert(e)
	if err != nil {
		return nil, err
	}
	newUser, err := p.userMapper.SelectById(*id)
	if err != nil {
		return nil, err
	}
	return newUser, nil
}

//Метод на обновление пользователя
func (p *UserProvider) Update(e *entity.User) (*entity.User, error) {
	err := p.userMapper.Update(e)
	if err != nil {
		return nil, err
	}

	newUser, err := p.userMapper.SelectById(e.Id)
	if err != nil {
		return nil, err
	}
	return newUser, nil
}

//Метод на удаление пользователя
func (p *UserProvider) Delete(id int) error {
	err := p.userMapper.Delete(id)
	if err != nil {
		return err
	}
	return nil
}
