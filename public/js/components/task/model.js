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
        return [
            {Name:"Task1",Project:"Проект 1",Status:"назначена",type:"Баг",hours:10,whom:"User2",author:"User1",description:"desc1"},
            {Name:"Task2",Project:"Проект 1",Status:"назначена",type:"Баг",hours:10,whom:"User2",author:"User1",description:"desc2"},
        ]
    },
    addTask(idProject) {
        //todo
    }
}
