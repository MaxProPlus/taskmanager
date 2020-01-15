let adminComponent = {
    //Обновить данные
    updateData() {
        return userModel.getUsers().then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            res.Data.forEach(el => {
                el.EmployeeId = el.Employee.Id
                let employee = employeeModel.Data.find(elem=>elem.Id==el.Employee.Id)
                el.EmployeeName = employee.Secondname+" "+employee.Firstname+" "+employee.Middlename
            })
            let table = $$('tableUser')
            table.define("data", res.Data)
            table.refresh()
        })
    },
    //Событие на поиск
    handlerSearch(value) {
        if (!value) return $$('tableUser').filter();

        $$('tableUser').filter(function(obj){
            return obj.Login.indexOf(value) !== -1;
        })
    },
    //Событие на кнопку "Добавить пользователя"
    handlerAddUser() {
        $$('userCreateModal').show()//Показать модальное окно
    },
    //Событие на просмотр пользователя
    handlerShowUser() {
        //Получить выделенный элемент из таблицы
        let el = $$('tableUser').getSelectedItem()
        if (el===undefined)
            return
        let data

        userModel.getById(el.Id).then((res)=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            data = res.Data
            return employeeModel.getById(res.Data.Employee.Id)
        }).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            data.EmployeeName = res.Data.Secondname+" "+res.Data.Firstname+" "+res.Data.Middlename
            $$('showUser').setValues(data)
            $$('userShowModal').show()
        })
    },
    //Событие на редактирование пользователя
    handlerEditUser() {
        //Получить выделенный элемент из таблицы
        let el = $$('tableUser').getSelectedItem()
        if (el===undefined) 
            return

        userModel.getById(el.Id).then((res)=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            res.Data.EmployeeId = res.Data.Employee.Id
            $$('editUser').setValues(res.Data)
            $$('userEditModal').show()
            
        })
    },
    //Событие на показ модального окна
    handlerOnShowModal() {
        let form = this.getChildViews()[1]
        form.clear()//Очистить предыдущие значения
    }
}