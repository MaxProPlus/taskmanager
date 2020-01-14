webix.ready(function(){
    //Отрендерить главную страницу
    adminView
    //Получить данные с сервера
    getData()
})

//Получить все данные с сервера
function getData() {
    //Получить значение с сервера для таблицы сотрудников
    employeeModel.getEmployees().then(res=>{
        if (res.Result != 0) {
            webix.message(res.ErrorText)
            return Promise.reject(res.ErrorText)
        }
        //Обработать значение под таблицу
        res.Data.forEach(el => {
            el.id = el.Id;
            el.value = el.Secondname+" "+el.Firstname+" "+el.Middlename
        });
        //Записать ответ в модель
        employeeModel.Data.splice(0,employeeModel.Data.length,...res.Data)
        return adminComponent.updateData()
    })
}