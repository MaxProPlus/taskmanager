package entity

//Сущность User
type User struct {
	Id       int
	Login    string
	Password string
	Token    string
	Employee *Employee
}
