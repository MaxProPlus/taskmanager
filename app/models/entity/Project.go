package entity

//Сущность Project
type Project struct {
	Id          int
	Name        string
	Description string
	Group       *Group
}
