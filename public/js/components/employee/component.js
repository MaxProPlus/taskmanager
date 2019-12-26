let employeeComponent = {
    handlerSearch(value) {
        if (!value) return $$('tableEmployee').filter();

        $$('tableEmployee').filter(function(obj){
            return obj.Secondname.indexOf(value) !== -1;
        })
    },
    handlerAddEmployee() {
        $$('employeeCreateModal').show()//Показать модальное окно
    },
    handlerShowEmployee() {
        //Получить выделенный элемент из таблицы
        let el = $$('tableEmployee').getSelectedItem()
        if (el===undefined)
            return
        //Записать в форму модального окна полученный элемент из таблицы
        $$('showEmployee').setValues(el)
        //Показать модальное окно
        $$('employeeShowModal').show()
    },
    handlerEditEmployee() {
        //Получить выделенный элемент из таблицы
        let el = $$('tableEmployee').getSelectedItem()
        if (el===undefined)
            return
        //Записать в форму модального окна полученный элемент из таблицы
        $$('editEmployee').setValues(el)
        //Показать модальное окно
        $$('employeeEditModal').show()
    },
    handlerOnShowModal() {
        $$('createEmployee').clear()//Очистить предыдущие значения
    }
}