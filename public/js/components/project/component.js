let projectComponent = {
    //Событие при поиске проекта
    handlerSearch(value) {
        if (!value) return $$('tableProject').filter();

        $$('tableProject').filter(function(obj){
            return obj.Name.indexOf(value) !== -1;
        })
    },
    //Кнопка на добавление проекта
    handlerAddProject() {
        $$('projectCreateModal').show()
    },
    //Кнопка на просмотр проекта
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
    //Кнопка на редактирование проекта
    handlerEditProject() {
        //Получить выделенный элемент из таблицы
        let el = $$('tableProject').getSelectedItem()
        if (el===undefined)
            return

        let form = $$('editProject')
        //Обновляет select
        form.getChildViews().find(el=>(el.config.name == "GroupId")?true:false).refresh()
        //Записать в форму модального окна полученный элемент из таблицы
        form.setValues(el)
        //Показать модальное окно
        $$('projectEditModal').show()
    },
    //Событие при показе модального окна
    handlerOnShow() {
        let form = $$('createProject')
        //Обновляет select
        form.getChildViews().find(el=>(el.config.name == "GroupId")?true:false).refresh()
        form.clear()//Очистить предыдущие значения
    }
}