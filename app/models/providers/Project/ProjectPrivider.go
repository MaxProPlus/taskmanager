package Project

import (
	"taskmanager/app/models/mappers"
	"taskmanager/app/models/entity"
	"database/sql"
)

//Провайдер на сущность Group
type ProjectProvider struct {
	DB *sql.DB
	projectMapper *mappers.ProjectMapper
}

//Инициализация маппера
func (p *ProjectProvider) Init() {
	p.projectMapper = &mappers.ProjectMapper{DB:p.DB}
}

//Метод для просмотра всех сотрудников
func (p *ProjectProvider) GetAll() (*[]entity.Project, error) {
	//получить всех сотрудников
	projects, err := p.projectMapper.SelectAll()
	if err != nil {
		return nil, err
	}
	return projects, nil
}

//Метод для просмотра одного сотудника
func (p *ProjectProvider) GetById(id int) (*entity.Project, error) {
	//получить сотрудника по id
	project, err := p.projectMapper.SelectById(id)
	if err != nil {
		return nil, err
	}
	return project, nil
}

//Метод на добавление нового сотрудника
func (p *ProjectProvider) Add(e *entity.Project) (*entity.Project, error) {
	id, err := p.projectMapper.Insert(e)
	if err != nil {
		return nil, err
	}
	newProject, err := p.projectMapper.SelectById(*id)
	if err != nil {
		return nil, err
	}
	return newProject, nil
}

//Метод на обновление сотрудника
func (p *ProjectProvider) Update(e *entity.Project) (*entity.Project, error) {
	err := p.projectMapper.Update(e)
	if err != nil {
		return nil, err
	}
	newProject, err := p.projectMapper.SelectById(e.Id)
	if err != nil {
		return nil, err
	}
	return newProject, nil
}

//Метод на удаление сотрудника
func (p *ProjectProvider) Delete(id int) error {
	//получить сотрудника по id
	err := p.projectMapper.Delete(id)
	return err
}
