let adminComponent = {
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

        //Записать в форму модального окна полученный элемент из таблицы
        $$('showUser').setValues(el)
        //Показать модальное окно
        $$('userShowModal').show()
    },
    //Событие на редактирование пользователя
    handlerEditUser() {
        //Получить выделенный элемент из таблицы
        let el = $$('tableUser').getSelectedItem()
        if (el===undefined)
            return
        //Записать в форму модального окна полученный элемент из таблицы
        $$('editUser').setValues(el)
        //Показать модальное окно
        $$('userEditModal').show()
    },
    //Событие на показ модального окна
    handlerOnShowModal() {
        let form = this.getChildViews()[1]
        form.clear()//Очистить предыдущие значения
    }
}