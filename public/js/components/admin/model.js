//Объект для работы с сущностью сотрудник
let userModel = {
    //Массив сущностей
    Data:[],
    //Получить список сотрудников
    getUsers() {
        //Запрос на сотрудников
        return fetch('/users').then(res => res.json())
    },
    //Получить пользователя по IdUser
    getById(IdUser) {
        let url = '/users/'+IdUser

        return fetch(url, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(r=>r.json())
    },
    //Добавить нового пользователя
    addUser() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить значение
            let user = this.getParentView().getValues()
            user.Employee = {
                Id: parseInt(user.EmployeeId),
            }

            //Запрос на добавление пользователя
            let url = "/users"
            let method = "PUT"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(user)
            }).then(response => response.json()).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return Promise.reject(res.ErrorText)
                }

                //Обработать значение под таблицу
                res.Data.EmployeeId = res.Data.Employee.Id
                let employee = employeeModel.Data.find(elem=>elem.Id==res.Data.Employee.Id)
                res.Data.EmployeeName = employee.Secondname+" "+employee.Firstname+" "+employee.Middlename
                //Добавить пользователя в таблицу
                let table = $$('tableUser')
                table.add(res.Data)
                table.select(res.Data.id)
                webix.message("Сотрудник добавлен")
                $$('userCreateModal').hide()
            })
        }
    },

    //Обновить пользователя
    updateUser() {
        if (this.getParentView().validate()) {
            let user = this.getParentView().getValues()
            user.Id = parseInt(user.Id)            
            user.Employee = {
                Id: parseInt(user.EmployeeId),
            }
            user.IsAdmin = !!user.IsAdmin

            let url = "/users/"+user.Id
            let method = "POST"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(user)
            }).then(response => response.json()).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }

                //Обработать значение под таблицу
                res.Data.EmployeeId = res.Data.Employee.Id
                let employee = employeeModel.Data.find(elem=>elem.Id==res.Data.Employee.Id)
                res.Data.EmployeeName = employee.Secondname+" "+employee.Firstname+" "+employee.Middlename
                // res.Data.EmployeeName = res.Data.Employee.Secondname+" "+res.Data.Employee.Firstname+" "+res.Data.Employee.Middlename
                // indexUser = employeeModel.Data.findIndex(el=>el.Id==res.Data.Id)
                // employeeModel.Data[indexUser] = res.Data

                //Обновить элемент в таблице
                let el = $$('tableUser').getSelectedItem()
                $$('tableUser').updateItem(el.id, res.Data)
                webix.message("Сотрудник обновлен")
                $$('userEditModal').hide()
            })
        }
    },

    //Удалить пользователя
    removeUser() {
        //Получить выделенный элемент
        let el = $$('tableUser').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить пользователя?").then(function (result) {
            let url = "/users/" + el.Id
            let method = "DELETE"

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            }).then(response => response.json()).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }

                indexUser = employeeModel.Data.findIndex(elem=>elem.Id==el.Id)
                employeeModel.Data.splice(indexUser,1)
                $$('tableUser').remove(el.id)
                $$('tableUser').refresh()
                webix.message("Удалено");
            })
        });
    }
}