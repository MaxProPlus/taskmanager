let taskComponent = {
    //Поиск проектов
    handlerSearchProject(value) {
        if (!value) return $$('listProject').filter();

        $$('listProject').filter(function(obj){
            return obj.Name.indexOf(value) !== -1;
        })
    },
    handlerSearchTask(value) {
        if (!value) return $$('tableTask').filter();

        $$('tableTask').filter(function(obj){
            return obj.Name.indexOf(value) !== -1;
        })
    },
    handlerAddTask() {
        $$('taskCreateModal').show()
    },
    handlerShowTask() {
        let el = $$('tableTask').getSelectedItem()
        if (el===undefined)
            return
        $$('showTask').setValues(el)
        $$('taskShowModal').show()
    },
    handlerEditTask() {
        let el = $$('tableTask').getSelectedItem()
        if (el===undefined)
            return
        $$('editTask').clear()
        $$('editTask').setValues(el)
        $$('taskEditModal').show()
    },
    handlerOnShow() {
        $$('createTask').clear()//Очистить предыдущие значения
    },
    handlerChangeProject() {
        let selected = $$('listProject').getSelectedItem()
        let table = $$('tableTask')
        taskModel.getTasks(selected.Id).then(Data=>{
            Data.forEach(el=>{
                el.StatusId = el.Status.Id
                el.StatusName = el.Status.Name
                el.TypeId = el.Type.Id
                el.TypeName = el.Type.Name
                el.AuthorId = el.Author.Id
                el.AuthorName = el.Author.Secondname+" "+el.Author.Firstname+" "+el.Author.Middlename
                if (!!el.Perfomer) {
                    el.PerfomerId = el.Perfomer.Id
                    el.PerfomerName = el.Perfomer.Secondname+" "+el.Perfomer.Firstname+" "+el.Perfomer.Middlename
                }
            })
            table.clearAll()
            table.define("data", Data)
            table.refresh()
        })
    }
}