let taskModel = {
    getTasks(idProject) {
        //Запрос на задачи
        return fetch('/projects/'+idProject+'/tasks').then(res=>res.json()).then(res => {
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }

            return res.Data
        })
    },
    addTask() {
        let selected = $$('listProject').getSelectedItem()
        if (typeof selected == "undefined") {
            webix.message("Не выбран проект")
            return
        }
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить сущность
            let task = this.getParentView().getValues()
            
            //Обработать объект для передачи серверу
            if (!!task.PerfomerId) {
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

            //Запрос на добавление задачи
            let url = "/projects/"+selected.Id+"/tasks"
            let method = "PUT"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(task)
            }).then(response => response.json()).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }

                //Обработать значение под таблицу
                res.Data.AuthorId = res.Data.Author.Id
                res.Data.AuthorName = res.Data.Author.Secondname+" "+res.Data.Author.Firstname+" "+res.Data.Author.Middlename
                res.Data.StatusId = res.Data.Status.Id
                res.Data.StatusName = res.Data.Status.Name
                res.Data.TypeId = res.Data.Type.Id
                res.Data.TypeName = res.Data.Type.Name

                //Добавить задачу в таблицу
                $$('tableTask').add(res.Data)
                webix.message("Задача добавлена")
                $$('taskCreateModal').hide()
            })
        }
    },
    updateTask() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить сущность
            let task = this.getParentView().getValues()

            //Обработать объект для передачи серверу
            if (!!task.PerfomerId) {
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

            let url = "/projects/0/tasks/"+task.Id
            let method = "POST"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(task)
            }).then(response => response.json()).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }

                //Обработать значение под таблицу
                res.Data.AuthorId = res.Data.Author.Id
                res.Data.AuthorName = res.Data.Author.Secondname+" "+res.Data.Author.Firstname+" "+res.Data.Author.Middlename
                res.Data.StatusId = res.Data.Status.Id
                res.Data.TypeId = res.Data.Type.Id
                if (!!res.Data.Perfomer) {
                    res.Data.PerfomerId = res.Data.Perfomer.Id
                    res.Data.PerfomerName = res.Data.Perfomer.Secondname+" "+res.Data.Perfomer.Firstname+" "+res.Data.Perfomer.Middlename
                }

                //Обновить элемент в таблице
                let el = $$('tableTask').getSelectedItem()
                $$('tableTask').updateItem(el.id, res.Data)
                webix.message("Задача обновлена")
                $$('taskEditModal').hide()
            })
        }
    },
    deleteTask() {
        //Получить выделенный элемент
        let el = $$('tableTask').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить задачу?").then(function (result) {
            //Запрос на удаление задачи
            let url = "/projects/0/tasks/" + el.Id
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
                $$('tableTask').remove(el.id)
                $$('tableTask').refresh()
                webix.message("Удалено");
            })
        });
    }
}
