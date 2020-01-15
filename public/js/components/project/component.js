let projectComponent = {
    //Обновить данные
    updateData() {
        return projectModel.getProjects().then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            let table = $$('tableProject')
    
            //Обработать значения под таблицу
            res.Data.forEach(el => {
                el.GroupName = el.Group.Name
                el.GroupId = el.Group.Id
            });
    
            //Записать ответ в projectModel
            projectModel.Data.splice(0,projectModel.Data.length,...res.Data)
            //Записать ответ в лист
            $$('listProject').clearAll()
            $$('listProject').define("data", res.Data)
            $$('listProject').select($$('listProject').getFirstId())
            //Записать ответ в таблицу
            table.clearAll()
            table.define("data", res.Data)
            table.refresh()
    
        })
    },
    //Обновляет select в формах
    updateForm(form) {
        return groupModel.getGroups().then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            res.Data.forEach(el=>{
                el.id = el.Id
                el.value = el.Name
            })
            form.getChildViews().find(el=>(el.config.name == "GroupId")?true:false).define('options', res.Data)
            form.getChildViews().find(el=>(el.config.name == "GroupId")?true:false).refresh()
        })
    },
    //Событие при поиске проекта
    handlerSearch(value) {
        if (!value) return $$('tableProject').filter();

        $$('tableProject').filter(function(obj){
            return obj.Name.indexOf(value) !== -1;
        })
    },
    //Окно добавления
    handlerModalAdd() {
        let form = $$('createProject')
        projectComponent.updateForm(form).then(()=>{
            $$('projectCreateModal').show()
            form.clear()
        })
    },
    //Окно просмотра
    handlerModalShow() {
        //Получить выделенный элемент из таблицы
        let project = $$('tableProject').getSelectedItem()
        if (project===undefined){
            return
        }
        //Запрос к бд
        projectModel.getById(project.Id).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }
            res.Data.GroupName = res.Data.Group.Name
            $$('projectShowModal').show()
            $$('showProject').setValues(res.Data)
        })
    },
    //Окно редактирования
    handlerModalEdit() {
        //Получить выделенный элемент из таблицы
        let project = $$('tableProject').getSelectedItem()
        if (project===undefined)
            return

        let form = $$('editProject')
        let data

        //Запрос к бд
        projectModel.getById(project.Id).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            res.Data.GroupId = res.Data.Group.Id
            data = res.Data
            return projectComponent.updateForm(form)
        }).then(()=>{
            $$('projectEditModal').show()
            form.setValues(data)
        })
    },
    //Кнопка сохранить у окна создания
    handlerSaveModalAdd() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить значение
            let project = this.getParentView().getValues()
            
            //Обработать объект для передачи серверу
            project.Group = {
                Id: parseInt(project.GroupId),
            }

            //Запрос на добавление проекта
            projectModel.add(project).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }

                //Обработать значение под таблицу
                res.Data.GroupId = res.Data.Group.Id
                res.Data.GroupName = res.Data.Group.Name
                projectModel.Data.push(res.Data)

                //Добавить проект в таблицу
                let table = $$('tableProject')
                let list = $$('listProject')
                table.add(res.Data)
                list.add(res.Data)
                table.select(res.Data.id)
                list.select(res.Data.id)

                webix.message("Проект добавлен")
                $$('projectCreateModal').hide()
            })
        }
    },
    //Кнопка сохранить у окна редактирования
    handlerSaveModalEdit() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить значение
            let project = this.getParentView().getValues()

            //Обработать объект для передачи серверу
            project.Id = parseInt(project.Id)            
            project.Group = {
                Id: parseInt(project.GroupId),
            }

            projectModel.update(project).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return Promise.reject(res.ErrorText)
                }

                //Обработать значение под таблицу
                res.Data.GroupId = res.Data.Group.Id
                res.Data.GroupName = res.Data.Group.Name

                indexProject = projectModel.Data.findIndex(el=>el.Id==res.Data.Id)
                projectModel.Data[indexProject] = res.Data

                //Обновить элемент в таблице
                let el = $$('tableProject').getSelectedItem()
                $$('tableProject').updateItem(el.id, res.Data)
                $$('listProject').updateItem(el.id, res.Data)
                webix.message("Проект обновлен")
                $$('projectEditModal').hide()
            })
        }
    },
    //Кнопка "Удалить"
    handlerDelete() {
        //Получить выделенный элемент
        let el = $$('tableProject').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить проект?").then(function (result) {
            //Запрос на удаление проекта
            projectModel.remove(el.Id).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }
                indexProject = projectModel.Data.findIndex(elem=>elem.Id==el.Id)
                projectModel.Data.splice(indexProject, 1)
                //Удалить элемент из таблицы
                $$('tableProject').remove(el.id)
                $$('tableProject').refresh()
                $$('listProject').remove(el.id)
                $$('listProject').refresh()
                webix.message("Удалено");
            })
        });
    }
}