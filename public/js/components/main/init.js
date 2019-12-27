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
        //Записать ответ в модель
        employeeModel.Data.splice(0,employeeModel.Data.length,...Data)
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
        //Записать ответ в groupModel
        groupModel.Data.splice(0,groupModel.Data.length,...Data)
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

        //Записать ответ в projectModel
        projectModel.Data.splice(0,projectModel.Data.length,...Data)
        //Записать ответ в лист
        $$('listProject').define("data", Data)
        $$('listProject').select($$('listProject').getFirstId())
        //Записать ответ в таблицу
        table.define("data", Data)
        table.refresh()

    })

    //Вспомогательные константы для options
    helpersModel.init();

}