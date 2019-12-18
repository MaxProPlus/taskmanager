package Task

import (
	"database/sql"
	"taskmanager/app/models/entity"
	"taskmanager/app/models/mappers"
)

//Провайдер на сущность Task
type TaskProvider struct {
	DB         *sql.DB
	taskMapper *mappers.TaskMapper
}

//Инициализация маппера
func (p *TaskProvider) Init() {
	p.taskMapper = &mappers.TaskMapper{DB: p.DB}
}

//Метод для просмотра всех задач
func (p *TaskProvider) GetAll(id int) (*[]entity.Task, error) {
	//получить все задачи
	tasks, err := p.taskMapper.SelectAll(id)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

//Метод для просмотра одной задачи
func (p *TaskProvider) GetById(id int) (*entity.Task, error) {
	//получить задачу по id
	task, err := p.taskMapper.SelectById(id)
	if err != nil {
		return nil, err
	}
	children, err := p.taskMapper.SelectWhereParent(id)
	if err != nil {
		return nil, err
	}
	task.Children = children
	return task, nil
}

//Метод на добавление новой задачи
func (p *TaskProvider) Add(e *entity.Task) (*entity.Task, error) {
	var id *int
	var err error
	if e.Parent != nil {
		id, err = p.taskMapper.InsertChild(e)
		if err != nil {
			return nil, err
		}
	} else {
		id, err = p.taskMapper.InsertRoot(e)
		if err != nil {
			return nil, err
		}
	}

	newTask, err := p.taskMapper.SelectById(*id)
	if err != nil {
		return nil, err
	}
	return newTask, nil
}

//Метод на обновление задачи
func (p *TaskProvider) Update(e *entity.Task) (*entity.Task, error) {
	err := p.taskMapper.Update(e)
	if err != nil {
		return nil, err
	}
	newTask, err := p.taskMapper.SelectById(e.Id)
	if err != nil {
		return nil, err
	}
	return newTask, nil
}

//Метод на удаление задачи
func (p *TaskProvider) Delete(id int) error {
	err := p.taskMapper.Delete(id)
	if err != nil {
		return err
	}
	return nil
}
