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
	//Обновить группу
	err := p.groupMapper.Update(e)
	if err != nil {
		return nil, err
	}

	//Получить группу со старым списком участников
	oldGroup, err := p.GetById(e.Id)
	if err != nil {
		return nil, err
	}

	//Удалить повторяющиеся участники в двух группах
	for i := 0; i < len(*e.Members); {
		find := false
		for j := 0; j < len(*oldGroup.Members); j++ {
			if (*e.Members)[i].Id == (*oldGroup.Members)[j].Id {
				*e.Members = append((*e.Members)[:i], (*e.Members)[i+1:]...)
				*oldGroup.Members = append((*oldGroup.Members)[:j], (*oldGroup.Members)[j+1:]...)
				find = true
				break
			}
		}
		if !find {
			i++
		}
	}
	//Удалить участников, которых нет в новой группе
	for _, vOld := range *oldGroup.Members {
		err := p.groupMapper.DeleteMember(oldGroup, &vOld)
		if err != nil {
			return nil, err
		}
	}
	//Добавить участников, которых нет в старой группе
	for _, vNew := range *e.Members {
		err := p.groupMapper.InsertMember(e, &vNew)
		if err != nil {
			return nil, err
		}
	}

	//Получить итоговую группу
	newGroup, err := p.GetById(e.Id)
	if err != nil {
		return nil, err
	}

	return newGroup, nil
}

//Метод на удаление группы
func (p *GroupProvider) Delete(id int) error {
	//получить группу по id
	err := p.groupMapper.Delete(id)
	return err
}
