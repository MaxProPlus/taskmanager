//Объект для работы с сущностью группы
let groupModel = {
    //Массив сущностей
    Data: [],
    //Получить список групп
    getGroups() {
        //Запрос на группы
        return fetch('/groups').then(res => res.json())
    },

    //Получить группу по Id
    getGroupById(idGroup) {
        //Запрос на группу
        let url = '/groups/' + idGroup
        return fetch(url).then(r=>r.json())
    },
    add(group) {
        let url = "/groups"
        let method = "PUT"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(group)
        }).then(response => response.json())
    },
    
    //Обновить группу
    update(group) {
        let url = "/groups/"+group.Id
        let method = "POST"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(group)
        }).then(response => response.json())
    },
    
    //Удалить группу
    delete(idGroup) {
        let url = "/groups/" + idGroup
        let method = "DELETE"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => response.json())
    },
    
}