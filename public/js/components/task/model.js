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
    addTask(idProject, task) {
        //Запрос на добавление задачи
        let url = "/projects/"+idProject+"/tasks"
        let method = "PUT"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(task)
        }).then(response => response.json())
    },
    //Обновить задачу
    update(idProject, task) {
        let url = "/projects/"+idProject+"/tasks/"+task.Id
        let method = "POST"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(task)
        }).then(response => response.json())
    },
    //Удалить задачу
    delete(idProject, idTask) {
        let url = "/projects/"+idProject+"/tasks/" + idTask
        let method = "DELETE"
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => response.json())
    },
}
