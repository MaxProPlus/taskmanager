//Объект для работы с сущностью сотрудник
let employeeModel = {
    //Массив сущностей
    Data:[],
    //Получить список сотрудников
    getEmployees() {
        //Запрос на сотрудников
        return fetch('/employees').then(res => res.json())
    },
    
    //Получить сотрудника по IdEmployee
    getById(IdEmployee) {
        let url = '/employees/'+IdEmployee

        return fetch(url, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(r=>r.json())
    },
    //Добавить нового сотрудника
    add(employee) {
        let url = "/employees"
        let method = "PUT"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(employee)
        }).then(response => response.json())
    },
    //Обновить сотрудника
    update(employee) {
        let url = "/employees/"+employee.Id
        let method = "POST"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(employee)
        }).then(response => response.json())
    },
    //Удалить сотрудника
    delete(IdEmployee) {
        let url = "/employees/" + IdEmployee
        let method = "DELETE"

        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(res => res.json())
    },
}