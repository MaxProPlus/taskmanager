package Group

import (
	"database/sql"
	"taskmanager/app/models/entity"
	"taskmanager/app/models/mappers"
)

//Провайдер на сущность Group
type GroupProvider struct {
	DB          *sql.DB
	groupMapper *mappers.GroupMapper
}

//Инициализация маппера
func (p *GroupProvider) Init() {
	p.groupMapper = &mappers.GroupMapper{DB: p.DB}
}

//Метод для просмотра всех групп
func (p *GroupProvider) GetAll() (*[]entity.Group, error) {
	//получить все группы
	groups, err := p.groupMapper.SelectAll()
	if err != nil {
		return nil, err
	}
	return groups, nil
}

//Метод для просмотра одной группы
func (p *GroupProvider) GetById(id int) (*entity.Group, error) {
	//получить группу по id
	group, err := p.groupMapper.SelectById(id)
	if err != nil {
		return nil, err
	}
	group.Members, err = p.groupMapper.SelectMembersById(id)
	if err != nil {
		return nil, err
	}
	return group, nil
}

//Метод на добавление новой группы
func (p *GroupProvider) Add(e *entity.Group) (*entity.Group, error) {
	id, err := p.groupMapper.InsertGroup(e)
	if err != nil {
		return nil, err
	}
	e.Id = *id
	for _, member := range *e.Members {
		err := p.groupMapper.InsertMember(e, &member)
		if err != nil {
			return nil, err
		}
	}
	newGroup, err := p.groupMapper.SelectById(*id)
	if err != nil {
		return nil, err
	}
	return newGroup, nil
}

//Метод на обновление группы
func (p *GroupProvider) Update(e *entity.Group) (*entity.Group, error) {
	err := p.groupMapper.Update(e)
	if err != nil {
		return nil, err
	}
	newGroup, err := p.groupMapper.SelectById(e.Id)
	if err != nil {
		return nil, err
	}
	for iNew, vNew := range *e.Members {
		find := false
		for iOld, vOld := range *newGroup.Members {
			if vOld.Id == vNew.Id {
				e.Members = append(e.Members[])
				copy(*e.Members[iNew:], *e.Members[iNew+1:])
				*e.Members[len(*e.Members)-1] = nil
				*e.Members = *e.Members[:len(*e.Members)-1
			}
		}
	}
	return newGroup, nil
}

//Метод на удаление группы
func (p *GroupProvider) Delete(id int) error {
	//получить группу по id
	err := p.groupMapper.Delete(id)
	return err
}
