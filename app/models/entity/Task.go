package entity

//Сущность Task
type Task struct {
	Id          int
	Name        string
	Description string
	Hours       int
	Status      *TaskStatus
	Type        *TaskType
	Project     *Project
	Perfomer    *Employee
	Author      *Employee
	Parent      *Task
	Children    *[]Task
}
