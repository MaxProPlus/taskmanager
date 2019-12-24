//Объект для работы с сущностью группы
let groupModel = {
    //Получить список групп
    getGroups() {
        //Запрос на группы
        fetch('/groups').then(res => res.json()).then(res => {
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }

            //Обработать значения под таблицу
            res.Data.forEach(el => {
                el.LeaderId = el.Leader.Id
                el.LeaderName = el.Leader.Secondname+" "+el.Leader.Firstname+" "+el.Leader.Middlename
            });

            //Записать ответ в таблицу
            this.define("data", res.Data)
            this.refresh()
        })
    },

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


            console.log(group)

            // return

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
                //Удалить элемент из таблицы
                $$('tableGroup').remove(el.id)
                $$('tableGroup').refresh()
                webix.message("Удалено");
            })
        });
    }
}