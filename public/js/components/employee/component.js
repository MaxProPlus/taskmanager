let employeeComponent = {
    //Обновить таблицу
    updateData() {
        //Получить значение с сервера для таблицы сотрудников
        return employeeModel.getEmployees().then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            let table = $$('tableEmployee')
            //Обработать значение под таблицу
            res.Data.forEach(el => {
                el.PositionName = el.Position.Name
                el.PositionId = el.Position.Id
                el.id = el.Id;
                el.value = el.Secondname+" "+el.Firstname+" "+el.Middlename
            });
            //Записать ответ в модель
            employeeModel.Data.splice(0,employeeModel.Data.length,...res.Data)
            //Записать ответ в таблицу
            table.clearAll()
            table.define("data", res.Data)
            table.refresh()
        })
    },
    //Событие на поиск
    handlerSearch(value) {
        if (!value) return $$('tableEmployee').filter();

        $$('tableEmployee').filter(function(obj){
            return obj.Secondname.indexOf(value) !== -1;
        })
    },
    //Событие кнопки "Добавить сотрудника"
    handlerAddEmployee() {
        $$('employeeCreateModal').show()//Показать модальное окно
    },
    //Событие кнопки "Посмотреть"
    handlerShowEmployee() {
        //Получить выделенный элемент из таблицы
        let employee = $$('tableEmployee').getSelectedItem()
        if (employee===undefined)
            return

        //Запрос к бд
        employeeModel.getById(employee.Id).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }
            res.Data.PositionName = res.Data.Position.Name
            $$('employeeShowModal').show()
            $$('showEmployee').setValues(res.Data)
        })
    },
    //Событие кнопки "Редактировать"
    handlerEditEmployee() {
        //Получить выделенный элемент из таблицы
        let el = $$('tableEmployee').getSelectedItem()
        if (el===undefined)
            return

        //Запрос к бд
        employeeModel.getById(el.Id).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }
            res.Data.PositionId = res.Data.Position.Id

            $$('employeeEditModal').show()
            $$('editEmployee').setValues(res.Data)
        })
    },
    //Событие при выводе модального окна
    handlerOnShowModal() {
        $$('createEmployee').clear()//Очистить предыдущие значения
    }
}