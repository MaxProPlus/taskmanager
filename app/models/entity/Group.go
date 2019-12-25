package entity

//Сущность Group
type Group struct {
	Id      int
	Name    string
	Leader  *Employee
	Members *[]Employee
}
