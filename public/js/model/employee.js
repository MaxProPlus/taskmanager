//Объект для работы с сущностью сотрудник
let employeeModel = {
    //Получить список сотрудников
    getEmployees() {
        //Запрос на сотрудников
        fetch('/employees').then(res => res.json()).then(res => {
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }
            res.Data.forEach(el => {
                el.PositionName = el.Position.Name
                el.PositionId = el.Position.Id
            });
            //Записать ответ в таблицу
            this.define("data", res.Data)
            this.refresh()
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

                //Добавить сотрудника в таблицу
                $$('tableEmployee').add(res.Data)
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
                $$('tableEmployee').remove(el.id)
                $$('tableEmployee').refresh()
                webix.message("Удалено");
            })
        });
    }
}