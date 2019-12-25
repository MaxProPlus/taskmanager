webix.ready(function(){
    //Отрендерить главную страницу
    mainView.render()
    //Получить данные с сервера
    getData()
    // $$('listProject').select(0)
})

function getData() {
    //Получить значение с сервера для таблицы сотрудников
    employeeModel.getEmployees().then(Data=>{
        let table = $$('tableEmployee')
        //Обработать значение под таблицу
        Data.forEach(el => {
            el.PositionName = el.Position.Name
            el.PositionId = el.Position.Id
            el.id = el.Id;
            el.value = el.Secondname+" "+el.Firstname+" "+el.Middlename
        });
        //Записать ответ в helpersModel
        helpersModel.MembersOptions.splice(0,helpersModel.MembersOptions.length,...Data)
        //Записать ответ в таблицу
        table.define("data", Data)
        table.refresh()
    })

    //Получить значение с сервера для таблицы групп
    groupModel.getGroups().then(Data=>{
        let table = $$('tableGroup')
        
        //Обработать значения под таблицу
        Data.forEach(el => {
            el.LeaderId = el.Leader.Id
            el.LeaderName = el.Leader.Secondname+" "+el.Leader.Firstname+" "+el.Leader.Middlename
            el.id = el.Id;
            el.value = el.Name;

        });
        //Записать ответ в helpersModel
        helpersModel.GroupsOptions.splice(0,helpersModel.GroupsOptions.length,...Data)
        //Записать ответ в таблицу
        table.define("data", Data)
        table.refresh()
    })

    projectModel.getProjects().then(Data=>{
        let table = $$('tableProject')

        //Обработать значения под таблицу
        Data.forEach(el => {
            el.GroupName = el.Group.Name
            el.GroupId = el.Group.Id
        });

        //Записать ответ в лист
        $$('listProject').define("data", Data)
        //Записать ответ в таблицу
        table.define("data", Data)
        table.refresh()

    })

    helpersModel.PositionsOptionsUpdate();

}