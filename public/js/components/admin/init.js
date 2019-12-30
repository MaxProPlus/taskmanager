webix.ready(function(){
    //Отрендерить главную страницу
    adminView.render()
    //Получить данные с сервера
    getData()
})

function getData() {
    //Получить значение с сервера для таблицы сотрудников
    employeeModel.getEmployees().then(Data=>{
        //Обработать значение под таблицу
        Data.forEach(el => {
            // el.PositionName = el.Position.Name
            // el.PositionId = el.Position.Id
            el.id = el.Id;
            el.value = el.Secondname+" "+el.Firstname+" "+el.Middlename
        });
        //Записать ответ в модель
        employeeModel.Data.splice(0,employeeModel.Data.length,...Data)
    }).then(()=>{
            userModel.getUsers().then(Data=>{
                Data.forEach(el => {
                    //todo
                })
                let table = $$('tableUser')
                table.define("data", Data)
                table.refresh()
            })
            
        }
        
        
    )
}