let employeeComponent = {
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
        let el = $$('tableEmployee').getSelectedItem()
        if (el===undefined)
            return
        //Записать в форму модального окна полученный элемент из таблицы
        $$('showEmployee').setValues(el)
        //Показать модальное окно
        $$('employeeShowModal').show()
    },
    //Событие кнопки "Редактировать"
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
    //Событие при выводе модального окна
    handlerOnShowModal() {
        $$('createEmployee').clear()//Очистить предыдущие значения
    }
}