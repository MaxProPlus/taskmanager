//Объект для работы с сущностью группы
let groupModel = {
    //Массив сущностей
    Data: [],
    //Получить список групп
    getGroups() {
        //Запрос на группы
        return fetch('/groups').then(res => res.json()).then(res => {
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }
            return res.Data
        })
    },

    //Получить группу по Id
    getGroupById(idGroup) {
        //Запрос на группу
        let url = '/groups/' + idGroup
        return fetch(url).then(r=>r.json()).then(res => {
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }

            res.Data.LeaderId = res.Data.Leader.Id
            res.Data.LeaderName = res.Data.Leader.Secondname+" "+res.Data.Leader.Firstname+" "+res.Data.Leader.Middlename
            return res.Data
        })
    },

    //Добавить новую группу
    addGroup() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить сущность
            let group = this.getParentView().getValues()
            
            //Обработать объект для передачи серверу
            group.Leader = {
                Id: parseInt(group.LeaderId),
            }
            group.Members = []
            for (let key in group) {
                if (key.indexOf("member_")!=-1) {
                    group.Members.push({
                        Id: parseInt(group[key])
                    })
                }
            }

            //Запрос на добавление группы
            let url = "/groups"
            let method = "PUT"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(group)
            }).then(response => response.json()).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }

                //Обработать значение под таблицу
                res.Data.LeaderId = res.Data.Leader.Id
                res.Data.LeaderName = res.Data.Leader.Secondname+" "+res.Data.Leader.Firstname+" "+res.Data.Leader.Middlename
                res.Data.id = res.Data.Id
                res.Data.value = res.Data.Name

                //Добавить значение в массив сущностей
                groupModel.Data.push(res.Data)
                //Добавить группу в таблицу
                $$('tableGroup').add(res.Data)
                webix.message("Группа добавлена")
                $$('groupCreateModal').hide()
            })
        }
    },

    //Обновить группу
    updateGroup() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить значение
            let group = this.getParentView().getValues()

            //Обработать объект для передачи серверу
            group.Leader = {
                Id: parseInt(group.LeaderId),
            }

            group.Members = []

            for (let key in group) {
                if (key.indexOf("member_")!=-1) {
                    group.Members.push({
                        Id: parseInt(group[key])
                    })
                }
            }

            //Запрос на обновление группы
            let url = "/groups/"+group.Id
            let method = "POST"
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(group)
            }).then(response => response.json()).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }

                //Обработать значение под таблицу
                res.Data.LeaderId = res.Data.Leader.Id
                res.Data.LeaderName = res.Data.Leader.Secondname+" "+res.Data.Leader.Firstname+" "+res.Data.Leader.Middlename
                res.Data.id = res.Data.Id
                res.Data.value = res.Data.Name

                indexGroup = groupModel.Data.findIndex(el=>el.Id==res.Data.Id)
                groupModel.Data[indexGroup] = res.Data

                //Обновить элемент в таблице
                let el = $$('tableGroup').getSelectedItem()
                $$('tableGroup').updateItem(el.id, res.Data)
                webix.message("Группа обновлена")
                $$('groupEditModal').hide()
            })
        }
    },

    //Удалить группу
    removeGroup() {
        //Получить выделенный элемент
        let el = $$('tableGroup').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить группу?").then(function (result) {
            //Запрос на удаление группы
            let url = "/groups/" + el.Id
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

                //Удалить объект из массива сущностей
                indexGroup = groupModel.Data.findIndex(elem=>elem.Id==el.Id)
                groupModel.Data.splice(indexGroup,1)
                //Удалить элемент из таблицы
                $$('tableGroup').remove(el.id)
                $$('tableGroup').refresh()
                webix.message("Удалено");
            })
        });
    }
}