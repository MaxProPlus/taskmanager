let taskModel = {
    Data: [],
    //получить задачи по idProject
    getTasks(idProject) {
        //Запрос на задачу
        return fetch('/projects/'+idProject+'/tasks').then(res=>res.json())
    },
    //Получить задачу по idProject и idTask
    getById(idProject, idTask) {
        let url = '/projects/'+idProject+'/tasks/'+idTask

        return fetch(url, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(r=>r.json())
    },
    //Добавить задачу
    addTask() {
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
    //Обновить задачу
    updateTask() {
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


            let url = "/projects/"+project.Id+"/tasks/"+task.Id
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
    //Удалить задачу
    deleteTask() {
        //Получить выделенный элемент
        let el = $$('tableTask').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить задачу?").then(function (result) {
            //Запрос на удаление задачи
            let project = $$('listProject').getSelectedItem()
            let url = "/projects/"+project.Id+"/tasks/" + el.Id
            let method = "DELETE"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            }).then(response => response.json()).then(res => {
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
        });
    }
}
