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

//Метод для просмтора всех типов задач
func (p *TaskProvider) GetAllType() (*[]entity.TaskType, error) {
	task_types, err := p.taskMapper.SelectAllType()
	if err != nil {
		return nil, err
	}
	return task_types, nil
}

//Метод для просмтора всех статусов задач
func (p *TaskProvider) GetAllStatus() (*[]entity.TaskStatus, error) {
	task_status, err := p.taskMapper.SelectAllStatus()
	if err != nil {
		return nil, err
	}
	return task_status, nil
}

//Метод для просмотра одной задачи
func (p *TaskProvider) GetById(id int) (*entity.Task, error) {
	//получить задачу по id
	task, err := p.taskMapper.SelectById(id)
	if err != nil {
		return nil, err
	}
	switch task.Status.Id {
	case 1, 2:
		task.StatusList = &[]entity.TaskStatus{{Id: 1, Name: "Создана"}, {Id: 2, Name: "Назначена"}, {Id: 3, Name: "В работе"}}
	case 3:
		task.StatusList = &[]entity.TaskStatus{{Id: 3, Name: "В работе"}, {Id: 4, Name: "На проверке"}, {Id: 5, Name: "Выполнена"}}
	case 4:
		task.StatusList = &[]entity.TaskStatus{{Id: 4, Name: "На проверке"}, {Id: 5, Name: "Выполнена"}}
	case 5:
		task.StatusList = &[]entity.TaskStatus{{Id: 5, Name: "Выполнена"}}
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
		if e.Perfomer != nil {
			id, err = p.taskMapper.InsertChildWithPerfomer(e)
		} else {
			id, err = p.taskMapper.InsertChildWithoutPerfomer(e)
		}
	} else {
		if e.Perfomer != nil {
			id, err = p.taskMapper.InsertRootWithPerfomer(e)
		} else {
			id, err = p.taskMapper.InsertRootWithoutPerfomer(e)
		}
	}
	if err != nil {
		return nil, err
	}

	newTask, err := p.taskMapper.SelectById(*id)
	if err != nil {
		return nil, err
	}
	return newTask, nil
}

//Метод на обновление задачи
func (p *TaskProvider) Update(e *entity.Task) (*entity.Task, error) {
	var err error
	if e.Perfomer != nil {
		err = p.taskMapper.UpdateWithPerfomer(e)
	} else {
		err = p.taskMapper.UpdateWithoutPerfomer(e)
	}
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
