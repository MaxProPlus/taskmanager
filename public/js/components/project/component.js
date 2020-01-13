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
    //Кнопка на добавление проекта
    handlerAddProject() {
        let form = $$('createProject')
        projectComponent.updateForm(form).then(()=>{
            $$('projectCreateModal').show()
            form.clear()
        })
    },
    //Кнопка на просмотр проекта
    handlerShowProject() {
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
    //Кнопка на редактирование проекта
    handlerEditProject() {
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
}