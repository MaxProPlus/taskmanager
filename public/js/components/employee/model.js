//Объект для работы с сущностью сотрудник
let employeeModel = {
    //Массив сущностей
    Data:[],
    //Получить список сотрудников
    getEmployees() {
        //Запрос на сотрудников
        return fetch('/employees').then(res => res.json()).then(res => {
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }

            return res.Data
        })
    },

    //Добавить нового сотрудника
    addEmployee() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить значение
            let user = this.getParentView().getValues()
            user.Position = {
                Id: parseInt(user.PositionId),
            }

            //Запрос на добавление сотрудника
            let url = "/employees"
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
                    return
                }

                //Обработать значение под таблицу
                res.Data.PositionId = res.Data.Position.Id
                res.Data.PositionName = res.Data.Position.Name
                res.Data.PositionId = res.Data.Position.Id
                res.Data.PositionName = res.Data.Position.Name
                res.Data.id = res.Data.Id;
                res.Data.value = res.Data.Secondname+" "+res.Data.Firstname+" "+res.Data.Middlename
                employeeModel.Data.push(res.Data)
                
                //Добавить сотрудника в таблицу
                let table = $$('tableEmployee')
                table.add(res.Data)
                table.select(res.Data.id)
                webix.message("Сотрудник добавлен")
                $$('employeeCreateModal').hide()
            })
        }
    },

    //Обновить сотрудника
    updateEmployee() {
        if (this.getParentView().validate()) {
            let user = this.getParentView().getValues()
            user.Id = parseInt(user.Id)            
            user.Position = {
                Id: parseInt(user.PositionId),
            }
            let url = "/employees/"+user.Id
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
                res.Data.PositionId = res.Data.Position.Id
                res.Data.PositionName = res.Data.Position.Name
                res.Data.id = res.Data.Id;
                res.Data.value = res.Data.Secondname+" "+res.Data.Firstname+" "+res.Data.Middlename
                indexEmployee = employeeModel.Data.findIndex(el=>el.Id==res.Data.Id)
                employeeModel.Data[indexEmployee] = res.Data

                //Обновить элемент в таблице
                let el = $$('tableEmployee').getSelectedItem()
                $$('tableEmployee').updateItem(el.id, res.Data)
                webix.message("Сотрудник обновлен")
                $$('employeeEditModal').hide()
            })
        }
    },

    //Удалить сотрудника
    removeEmployee() {
        //Получить выделенный элемент
        let el = $$('tableEmployee').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить сотрудника?").then(function (result) {
            let url = "/employees/" + el.Id
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

                indexEmployee = employeeModel.Data.findIndex(elem=>elem.Id==el.Id)
                employeeModel.Data.splice(indexEmployee,1)
                $$('tableEmployee').remove(el.id)
                $$('tableEmployee').refresh()
                webix.message("Удалено");
            })
        });
    }
}