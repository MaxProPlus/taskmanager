package entity

//Сущность Task
type Task struct {
	Id          int
	Name        string
	Description string
	Hours       int
	Status      *TaskStatus
	StatusList  *[]TaskStatus
	Type        *TaskType
	Project     *Project
	Perfomer    *Employee
	Author      *Employee
	Parent      *Task
	Children    *[]Task
}
