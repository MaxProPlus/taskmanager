package entity

//Сущность Employee
type Employee struct {
	Id         int
	Firstname  string
	Secondname string
	Middlename string
	Position   *Position
}
