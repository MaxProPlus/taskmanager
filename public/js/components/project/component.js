let projectComponent = {
    handlerAddProject() {
        $$('projectCreateModal').show()
    },
    handlerShowProject() {
        //Получить выделенный элемент из таблицы
        let el = $$('tableProject').getSelectedItem()
        if (el===undefined)
            return
        //Записать в форму модального окна полученный элемент из таблицы
        $$('showProject').setValues(el)
        //Показать модальное окно
        $$('projectShowModal').show()
    },
    handlerEditProject() {
        //Получить выделенный элемент из таблицы
        let el = $$('tableProject').getSelectedItem()
        if (el===undefined)
            return
        //Записать в форму модального окна полученный элемент из таблицы
        $$('editProject').setValues(el)
        //Показать модальное окно
        $$('projectEditModal').show()
    },
    handlerOnShow() {
        $$('createProject').clear()//Очистить предыдущие значения
    }
}