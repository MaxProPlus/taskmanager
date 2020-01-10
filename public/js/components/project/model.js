//Объект для работы с сущностью проект
let projectModel = {
    //Массив сущностей
    Data: [],
    //Получить список проектов
    getProjects() {
        //Запрос на проекты
        return fetch('/projects').then(res => res.json()).then(res => {
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }
            return res.Data
        })
    },

    //Добавить новый проект
    addProject() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить значение
            let project = this.getParentView().getValues()
            
            //Обработать объект для передачи серверу
            project.Group = {
                Id: parseInt(project.GroupId),
            }

            //Запрос на добавление проекта
            let url = "/projects"
            let method = "PUT"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(project)
            }).then(response => response.json()).then(res => {
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

    //Обновить проект
    updateProject() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить значение
            let project = this.getParentView().getValues()

            //Обработать объект для передачи серверу
            project.Id = parseInt(project.Id)            
            project.Group = {
                Id: parseInt(project.GroupId),
            }

            let url = "/projects/"+project.Id
            let method = "POST"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(project)
            }).then(response => response.json()).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
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

    //Удалить проект
    removeProject() {
        //Получить выделенный элемент
        let el = $$('tableProject').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить проект?").then(function (result) {
            //Запрос на удаление проекта
            let url = "/projects/" + el.Id
            let method = "DELETE"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            }).then(response => response.json()).then(res => {
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