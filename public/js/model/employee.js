let employeeModel = {
    getEmployees(params) {
        
        return fetch('/employees').then(res=>res.json()).then(res=>{return res.Data})
        return [
            {Firstname:"User1",Secondname:"User1",Middlename:"Middlename",Position:"Тимлид"},
            {Firstname:"User2",Secondname:"User1",Middlename:"Middlename",Position:"Программист"},
        ]
    }
}
/*
	Firstname string
	Secondname string
	Middlename string
	Position Position */