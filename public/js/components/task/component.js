let taskComponent = {
    //Обновить данные
    updateData() {
        return taskComponent.handlerChangeProject()
    },
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
    //Окно добавления
    handlerModalAdd() {
        let form = $$('createTask')
        taskComponent.updateForm(form).then(()=>{
            $$('taskCreateModal').show()
            form.clear()
        })
    },
    //Окно просмотра
    handlerModalShow() {
        //Получить текущий проект
        let project = $$('listProject').getSelectedItem()
        if (typeof project == "undefined") {
            webix.message("Не выбран проект")
            return
        }
        //Получить выделенную задачу
        let task = $$('tableTask').getSelectedItem()
        if (task===undefined){
            webix.message("Не выбрана задача")
            return
        }
        //Запрос к бд
        taskModel.getById(project.Id, task.Id).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }

            res.Data.StatusName = res.Data.Status.Name
            res.Data.TypeName = res.Data.Type.Name

            res.Data.AuthorName = res.Data.Author.Secondname +" "+ res.Data.Author.Firstname +" "+ res.Data.Author.Middlename
            if (res.Data.Perfomer) {
                let perfomer = employeeModel.Data.find(per => per.Id==res.Data.Perfomer.Id)
                res.Data.PerfomerName = perfomer.Secondname +" "+ perfomer.Firstname +" "+ perfomer.Middlename
            }

            $$('showTask').setValues(res.Data)
            $$('taskShowModal').show()
        })
    },
    //Окно редактирования
    handlerModalEdit() {
        //Получить текущий проект
        let project = $$('listProject').getSelectedItem()
        if (typeof project == "undefined") {
            webix.message("Не выбран проект")
            return
        }
        //Получить выделенную задачу
        let task = $$('tableTask').getSelectedItem()
        if (task===undefined){
            webix.message("Не выбрана задача")
            return
        }
        let form = $$('editTask')
        let data
        //Запрос к бд
        return taskModel.getById(project.Id, task.Id).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }

            //Список статусов
            res.Data.StatusList.forEach(el=>{
                el.id = el.Id
                el.value = el.Name
            })
            form.getChildViews().find(el=>(el.config.name=="StatusId")?true:false).define("options", res.Data.StatusList)
            form.getChildViews().find(el=>(el.config.name=="StatusId")?true:false).refresh()

            res.Data.StatusId = res.Data.Status.Id
            res.Data.TypeId = res.Data.Type.Id
            res.Data.AuthorId = res.Data.Author.Id
            res.Data.AuthorName = res.Data.Author.Secondname +" "+ res.Data.Author.Firstname +" "+ res.Data.Author.Middlename
            if (res.Data.Perfomer) {
                res.Data.PerfomerId = res.Data.Perfomer.Id
            }

            data = res.Data
            return taskComponent.updateForm(form)
        }).then(()=>{
            $$('taskEditModal').show()
            $$('editTask').setValues(data)
        })
    },
    //Кнопка "Удалить"
    handlerDelete() {
        //Получить выделенный элемент
        let el = $$('tableTask').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить задачу?").then(function (result) {
            //Запрос на удаление задачи
            let project = $$('listProject').getSelectedItem()
            taskModel.delete(project.Id, el.Id).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return Promise.reject(res.ErrorText)
                }

                indexTask = taskModel.Data.findIndex(elem=>elem.Id==el.Id)
                taskModel.Data.splice(indexTask,1)

                //Удалить элемент из таблицы
                $$('tableTask').remove(el.id)
                $$('tableTask').refresh()
                webix.message("Удалено");
            })
        })
    },
    //Кнопка сохранить у окна создания
    handlerSaveModalAdd() {
        let selected = $$('listProject').getSelectedItem()
        if (typeof selected == "undefined") {
            webix.message("Не выбран проект")
            return
        }

        let task = this.getParentView().getValues()
        //Проверить валидацию полей
        if ((task.PerfomerId==""&&task.StatusId!=1)) {
            webix.message("Не выбран исполнитель")
            return
        }
        if (task.Hours < 1) {
            webix.message("Отрицательое кол-во часов")
            return
        }
        if (this.getParentView().validate()) {
            //Обработать объект для передачи серверу
            if (!!task.PerfomerId || task.PerfomerId !="") {
                task.Perfomer = {
                    Id: parseInt(task.PerfomerId),
                }
            }
            task.Status = {
                Id: parseInt(task.StatusId),
            }
            task.Type = {
                Id: parseInt(task.TypeId),
            }
            task.Hours = parseInt(task.Hours)

            taskModel.addTask(selected.Id, task).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return Promise.reject(res.ErrorText)
                }

                //Обработать значение под таблицу
                res.Data.AuthorId = res.Data.Author.Id
                res.Data.AuthorName = res.Data.Author.Secondname+" "+res.Data.Author.Firstname+" "+res.Data.Author.Middlename
                res.Data.StatusId = res.Data.Status.Id
                res.Data.StatusName = res.Data.Status.Name
                res.Data.TypeId = res.Data.Type.Id
                res.Data.TypeName = res.Data.Type.Name
                if (!!res.Data.Perfomer) {
                    let indexPerfomer = employeeModel.Data.findIndex(elem=>elem.Id==res.Data.Perfomer.Id)
                    res.Data.PerfomerId = res.Data.Perfomer.Id
                    res.Data.PerfomerName = employeeModel.Data[indexPerfomer].Secondname +" "+ employeeModel.Data[indexPerfomer].Firstname +" "+ employeeModel.Data[indexPerfomer].Middlename
                }


                //Добавить задачу в таблицу
                taskModel.Data.push(res.Data)
                let table = $$('tableTask')
                table.add(res.Data)
                table.select(res.Data.id)
                webix.message("Задача добавлена")
                $$('taskCreateModal').hide()
            })
        }
    },
    //Кнопка сохранить у окна редактирования
    handlerSaveModalEdit(){
        let task = this.getParentView().getValues()
        //Проверить валидацию полей
        if ((task.PerfomerId==""&&task.StatusId!=1)) {
            webix.message("Не выбран исполнитель")
            return
        }
        if (task.Hours < 1) {
            webix.message("Отрицательое кол-во часов")
            return
        }
        if (this.getParentView().validate()) {
            let project = $$('listProject').getSelectedItem()


            //Обработать объект для передачи серверу
            if (!!task.PerfomerId || task.PerfomerId !="") {
                task.Perfomer = {
                    Id: parseInt(task.PerfomerId),
                }
            } else {
                delete task.Perfomer
            }
            task.Status = {
                Id: parseInt(task.StatusId),
            }
            task.Type = {
                Id: parseInt(task.TypeId),
            }
            task.Hours = parseInt(task.Hours)


            taskModel.update(project.Id, task).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return Promise.reject(res.ErrorText)
                }

                //Обработать значение под таблицу
                res.Data.AuthorId = res.Data.Author.Id
                res.Data.AuthorName = res.Data.Author.Secondname+" "+res.Data.Author.Firstname+" "+res.Data.Author.Middlename
                res.Data.StatusId = res.Data.Status.Id
                res.Data.StatusName = res.Data.Status.Name
                res.Data.TypeId = res.Data.Type.Id
                res.Data.TypeName = res.Data.Type.Name
                if (!!res.Data.Perfomer) {
                    indexPerfomer = employeeModel.Data.findIndex(elem=>elem.Id==res.Data.Perfomer.Id)
                    res.Data.PerfomerId = res.Data.Perfomer.Id
                    res.Data.PerfomerName = employeeModel.Data[indexPerfomer].Secondname +" "+ employeeModel.Data[indexPerfomer].Firstname +" "+ employeeModel.Data[indexPerfomer].Middlename
                } else {
                    res.Data.PerfomerId = ""
                    res.Data.PerfomerName = ""
                }

                indexTask = taskModel.Data.findIndex(el=>el.Id==res.Data.Id)
                taskModel.Data[indexTask] = res.Data


                //Обновить элемент в таблице
                let el = $$('tableTask').getSelectedItem()
                $$('tableTask').updateItem(el.id, res.Data)
                webix.message("Задача обновлена")
                $$('taskEditModal').hide()
            })
        }
    },
    //Обновляет select в формах
    updateForm(form) {
        return employeeModel.getEmployees().then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            res.Data.forEach(el=>{
                el.id = el.Id
                el.value = el.Secondname +" "+ el.Firstname +" "+ el.Middlename
            })
            form.getChildViews().find(el=>(el.config.type == "line"&&el.getChildViews()[0].config.name=="PerfomerId")?true:false).getChildViews()[0]
                .define('options', res.Data)
            form.getChildViews().find(el=>(el.config.type == "line"&&el.getChildViews()[0].config.name=="PerfomerId")?true:false).getChildViews()[0].refresh()
        })
    },
    //Событие при изменения проекта
    //Получает id проекта и по нему получает список задач связанных с этим проектом
    handlerChangeProject() {
        let selected = $$('listProject').getSelectedItem()
        let table = $$('tableTask')
        return taskModel.getTasks(selected.Id).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            //Обработка задач под таблицу
            res.Data.forEach(el=>{
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
            taskModel.Data.splice(0,taskModel.Data.length,...res.Data)
            table.clearAll()
            table.define("data", res.Data)
            table.refresh()
        })
    }
}