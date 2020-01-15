webix.ready(function(){
    //Отрендерить главную страницу
    mainView.render()
    //Получить данные с сервера
    getData()
    // $$('listProject').select(0)
})

//Получить данные с сервера
function getData() {
    //Вспомогательные константы для options
    helpersModel.init();
    //Инициализация данных сотрудников
    employeeComponent.updateData().then(()=>{
    //Инициализация данных групп
        return groupComponent.updateData()
    }).then(()=>{
    //Инициализация данных проектов
        return projectComponent.updateData()
    })
}