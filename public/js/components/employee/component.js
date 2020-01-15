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
    //Окно добавления
    handlerModalAdd() {
        $$('employeeCreateModal').show()//Показать модальное окно
    },
    //Окно просмотра
    handlerModalShow() {
        //Получить выделенный элемент из таблицы
        let employee = $$('tableEmployee').getSelectedItem()
        if (employee===undefined)
            return

        //Запрос к бд
        employeeModel.getById(employee.Id).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            res.Data.PositionName = res.Data.Position.Name
            $$('employeeShowModal').show()
            $$('showEmployee').setValues(res.Data)
        })
    },
    //Окно редактирования
    handlerModalEdit() {
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
    //Кнопка сохранить у окна создания
    handlerSaveModalAdd() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить значение
            let user = this.getParentView().getValues()
            user.Position = {
                Id: parseInt(user.PositionId),
            }

            //Запрос на добавление сотрудника
            employeeModel.add(user).then(res => {
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
    //Кнопка сохранить у окна редактирования
    handlerSaveModalEdit() {
        if (this.getParentView().validate()) {
            let employee = this.getParentView().getValues()
            employee.Id = parseInt(employee.Id)            
            employee.Position = {
                Id: parseInt(employee.PositionId),
            }
            employeeModel.update(employee).then(res => {
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
    //Кнопка "Удалить"
    handlerDelete() {
        //Получить выделенный элемент
        let el = $$('tableEmployee').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить сотрудника?").then(function (result) {
            employeeModel.delete(el.Id).then(res => {
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
    },
    //Событие при выводе модального окна
    handlerOnShowModal() {
        $$('createEmployee').clear()//Очистить предыдущие значения
    }
}