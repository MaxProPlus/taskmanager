let taskComponent = {
    handlerSearchProject(newv) {
        if (!newv) return $$('listProject').filter();

        $$('listProject').filter(function(obj){
            return obj.Name.indexOf(newv) !== -1;
        })
    },
    handlerSearchTask(newv) {
        if (!newv) return $$('tableTask').filter();

        $$('tableTask').filter(function(obj){
            return obj.Name.indexOf(newv) !== -1;
        })
    },
    handlerAddTask() {
        $$('taskEditModal').show()
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
            table.clearAll()
            table.define("data", Data)
            table.refresh()
        })
        console.log(selected)
    }
}