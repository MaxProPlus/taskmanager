let employeeModel = {
    getEmployees(params) {
        fetch('/employees').then(res => res.json()).then(res => {
            //return res.Data
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }
            res.Data.forEach(el => {
                el.PositionName = el.Position.Name
                el.PositionId = el.Position.Id
            });
            this.define("data", res.Data)
            this.refresh()
        })
    },
    addEmployee() {
        if (this.getParentView().validate()) {
            let user = this.getParentView().getValues()
            user.Position = {
                Id: parseInt(user.PositionId),
            }
            let url = "http://localhost:9000/employees"
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
                res.Data.PositionId = res.Data.Position.Id
                res.Data.PositionName = res.Data.Position.Name
                $$('tableEmployee').add(res.Data)
                webix.message("Сотрудник добавлен")
                $$('employeeCreateModal').close()
            })
        }
    },
    updateEmployee() {
        if (this.getParentView().validate()) {
            let user = this.getParentView().getValues()
            user.Id = parseInt(user.Id)            
            user.Position = {
                Id: parseInt(user.PositionId),
            }
            let url = "http://localhost:9000/employees/"+user.Id
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
                res.Data.PositionId = res.Data.Position.Id
                res.Data.PositionName = res.Data.Position.Name
                let el = $$('tableEmployee').getSelectedItem()
                $$('tableEmployee').updateItem(el.id, res.Data)
                webix.message("Сотрудник обновлен")
                $$('employeeEditModal').close()
            })
        }
    },
    removeEmployee() {
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
        }).fail(function () {
            webix.message("Отмена");
        });
    }
}