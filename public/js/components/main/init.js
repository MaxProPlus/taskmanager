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
    employeeComponent.updateData()
    //Инициализация данных групп
    groupComponent.updateData()
    //Инициализация данных проектов
    projectComponent.updateData()
}