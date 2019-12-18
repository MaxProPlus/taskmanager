package entity

type Task struct {
	Id          int
	Name        string
	Description string
	Status      int
	Hours       int
	Type        TaskType
	Project     *Project
	Perfomer    *Employee
	Author      *Employee
	Parent      *Task
	Children    *[]Task
}
