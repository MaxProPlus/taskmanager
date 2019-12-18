package Group

import (
	"taskmanager/app/models/mappers"
	"taskmanager/app/models/entity"
	"database/sql"
)

//Провайдер на сущность Group
type GroupProvider struct {
	DB *sql.DB
	groupMapper *mappers.GroupMapper
}

//Инициализация маппера
func (p *GroupProvider) Init() {
	p.groupMapper = &mappers.GroupMapper{DB:p.DB}
}

//Метод для просмотра всех сотрудников
func (p *GroupProvider) GetAll() (*[]entity.Group, error) {
	//получить всех сотрудников
	groups, err := p.groupMapper.SelectAll()
	if err != nil {
		return nil, err
	}
	return groups, nil
}

//Метод для просмотра одного сотудника
func (p *GroupProvider) GetById(id int) (*entity.Group, error) {
	//получить сотрудника по id
	group, err := p.groupMapper.SelectById(id)
	if err != nil {
		return nil, err
	}
	return group, nil
}

//Метод на добавление нового сотрудника
func (p *GroupProvider) Add(e *entity.Group) (*entity.Group, error) {
	id, err := p.groupMapper.Insert(e)
	if err != nil {
		return nil, err
	}
	newGroup, err := p.groupMapper.SelectById(*id)
	if err != nil {
		return nil, err
	}
	return newGroup, nil
}

//Метод на обновление сотрудника
func (p *GroupProvider) Update(e *entity.Group) (*entity.Group, error) {
	err := p.groupMapper.Update(e)
	if err != nil {
		return nil, err
	}
	newGroup, err := p.groupMapper.SelectById(e.Id)
	if err != nil {
		return nil, err
	}
	return newGroup, nil
}

//Метод на удаление сотрудника
func (p *GroupProvider) Delete(id int) error {
	//получить сотрудника по id
	err := p.groupMapper.Delete(id)
	return err
}
