let taskModel = {
    getTasks(idProject) {
        //Запрос на задачи
        fetch('/projects/'+idProject+'/tasks').then(res=>res.json()).then(res => {
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }
                //Обработать значение под таблицу
            res.Data.forEach(el => {
                //todo
            })
            //Записать данные в таблицу
            this.define("data", res.Data)
            this.refresh()
        })
        return [
            {name:"Task1",project:"Проект 1",status:"назначена",type:"Баг",hours:10,whom:"User2",author:"User1",description:"desc1"},
            {name:"Task2",project:"Проект 1",status:"назначена",type:"Баг",hours:10,whom:"User2",author:"User1",description:"desc2"},
        ]
    },
    addTask(idProject) {
        //todo
    }
}
