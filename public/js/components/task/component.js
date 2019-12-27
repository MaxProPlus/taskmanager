let taskComponent = {
    //Поиск проектов
    handlerSearchProject(value) {
        if (!value) return $$('listProject').filter();

        $$('listProject').filter(function(obj){
            return obj.Name.indexOf(value) !== -1;
        })
    },
    //Поиск задач
    handlerSearchTask(value) {
        if (!value) return $$('tableTask').filter();

        $$('tableTask').filter(function(obj){
            return obj.Name.indexOf(value) !== -1;
        })
    },
    //Очистить поле исполнителя задачи
    handlerClearPerfomer() {
        this.getParentView().getChildViews()[0].setValue()
    },
    //Кнопка "Новая задача"
    handlerAddTask() {
        $$('taskCreateModal').show()
    },
    //Кнопка "Просмотреть"
    handlerShowTask() {
        //Получить выделенную задачу
        let el = $$('tableTask').getSelectedItem()
        if (el===undefined)
            return
        
        //Есть ли исполнитель у задачи
        indexPerfomer = employeeModel.Data.findIndex(elem=>elem.Id==el.PerfomerId)
        if (indexPerfomer != -1)
            el.PerfomerName = employeeModel.Data[indexPerfomer].Secondname +" "+ employeeModel.Data[indexPerfomer].Firstname +" "+ employeeModel.Data[indexPerfomer].Middlename

        //Задать значение и вывести модальное окно
        $$('showTask').setValues(el)
        $$('taskShowModal').show()
    },
    //Кнопка "Редактировать"
    handlerEditTask() {
        //Получить выделенную задачу
        let el = $$('tableTask').getSelectedItem()
        if (el===undefined)
            return

        //Очистить предыдущие значения формы
        $$('editTask').clear()
        //Задать значение и вывести модальное окно
        $$('editTask').setValues(el)
        $$('taskEditModal').show()
    },
    //Событие при показе модального окна на создание новой задачи
    handlerOnShow() {
        $$('createTask').clear()//Очистить предыдущие значения
    },
    //Событие при изменения проекта
    //Получает id проекта и по нему получает список задач связанных с этим проектом
    handlerChangeProject() {
        let selected = $$('listProject').getSelectedItem()
        let table = $$('tableTask')
        taskModel.getTasks(selected.Id).then(Data=>{
            Data.forEach(el=>{
                el.StatusId = el.Status.Id
                el.StatusName = el.Status.Name
                el.TypeId = el.Type.Id
                el.TypeName = el.Type.Name
                el.AuthorId = el.Author.Id
                el.AuthorName = el.Author.Secondname+" "+el.Author.Firstname+" "+el.Author.Middlename
                if (!!el.Perfomer) {
                    el.PerfomerId = el.Perfomer.Id
                    indexPerfomer = employeeModel.Data.findIndex(elem=>elem.Id==el.PerfomerId)
                    el.PerfomerName = employeeModel.Data[indexPerfomer].Secondname+" "+employeeModel.Data[indexPerfomer].Firstname+" "+employeeModel.Data[indexPerfomer].Middlename
                }
            })
            table.clearAll()
            table.define("data", Data)
            table.refresh()
        })
    }
}