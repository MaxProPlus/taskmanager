//Объект для работы с сущностью проект
let projectModel = {
    //Массив сущностей
    Data: [],
    //Получить список проектов
    getProjects() {
        //Запрос на проекты
        return fetch('/projects').then(res => res.json())
    },
    //Получить проект по idProject
    getById(idProject) {
        let url = '/projects/'+idProject

        return fetch(url, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(r=>r.json())
    },

    //Добавить новый проект
    add(project) {
        let url = "/projects"
        let method = "PUT"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(project)
        }).then(response => response.json())
    },

    //Обновить проект
    update(project) {
        let url = "/projects/"+project.Id
        let method = "POST"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(project)
        }).then(res => res.json())
    },
    //Удалить проект
    remove(idProject) {
        let url = "/projects/" + idProject
        let method = "DELETE"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => response.json())
    },
    
}