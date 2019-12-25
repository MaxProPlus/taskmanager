//Объект для работы с сущностью проект
let projectModel = {
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

                //Добавить проект в таблицу
                $$('tableProject').add(res.Data)
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

                //Обновить элемент в таблице
                let el = $$('tableProject').getSelectedItem()
                $$('tableProject').updateItem(el.id, res.Data)
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
                //Удалить элемент из таблицы
                $$('tableProject').remove(el.id)
                $$('tableProject').refresh()
                webix.message("Удалено");
            })
        });
    }
}