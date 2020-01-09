let adminComponent = {
    render() {
        webix.ui(adminView)
    },
    handlerSearch(value) {
        if (!value) return $$('tableUser').filter();

        $$('tableUser').filter(function(obj){
            return obj.Login.indexOf(value) !== -1;
        })
    },
    handlerAddUser() {
        $$('userCreateModal').show()//Показать модальное окно
    },
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
    handlerOnShowModal() {
        let form = this.getChildViews()[1]
        form.clear()//Очистить предыдущие значения
    }
}