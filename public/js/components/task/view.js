let taskView = {
    cols: [
        {margin:5,rows: [
            {template:"Проекты", type:"header"},
            {view:"button", value: "Новый проект",autowidth:true,css:"webix_primary",click:projectComponent.handlerAddProject},
            {view:"text", placeholder:"Поиск",on:{onChange:taskComponent.handlerSearchProject}},
            {view:"list",id:"listProject",select: true,template:"#Name#",on:{onSelectChange:taskComponent.handlerChangeProject}},
        ]},
        {view:"resizer"},
        {margin:5,rows: [
            {template:"Задачи", type:"header"},
            {cols:[
                {view:"button",value:"Новая задача",autowidth:true,css:"webix_primary",click:function(_id){
                    $$('taskEditModal').show()
                }},
                {},
                {view:"select",value:1,width:150,options:[
                    {id:1,value:"Все"},
                    {id:2,value:"Мои задачи"},
                    {id:3,value:"Мне назначили"},
                ]},
            ]},
            {view:"text",placeholder:"Поиск",on:{onChange:taskComponent.handlerSearchTask}},
            {view:"datatable",id:"tableTask",select:true,columns:[
                {id:"Name",header:"Имя",fillspace:1},
                {id:"Status",header:"Статус"},
                {id:"Type",header:"Тип"},
                {id:"Hours",header:"Время"},
                {id:"Perfomer",header:"Назначенно",fillspace:1},
                {id:"Author",header:"Автор",fillspace:1},
            ],data:taskModel.getTasks()},
            {view:"toolbar",elements:[
                {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:taskComponent.handlerShowTask},
                {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:taskComponent.handlerEditTask},
                {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:function(){
                    webix.confirm("Удалить задачу?").then(function(result){
                        webix.message("Удалено");
                    }).fail(function(){
                      webix.message("Отмена");
                  });
                }},
            ]}
        ]}
    ]
}

//Модальное окно на создание задачи
webix.ui({view:"window",close:true,id:"taskCreateModal",position:"center",modal:true,on:{onShow:taskComponent.handlerOnShow},body:{view:"form",id:"createTask",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"name",label:"Имя"},
    {view:"textarea",name:"description",label:"Описание"},
    {view:"text",name:"hours",label:"Кол-во часов"},
    {view:"select",name:"status",label:"Статус",options:[
        {id:1,value:"Создана"},
        {id:2,value:"Назначена"},
        {id:3,value:"На проверке"},
        {id:4,value:"Выполнена"},
    ]},
    {view:"select",name:"type",label:"Тип",options:[
        {id:1,value:"Фича"},
        {id:2,value:"Баг"},
        {id:3,value:"Фикс"},
        {id:4,value:"Тест"},
    ]},
    {view:"select",name:"whom",label:"Кому назначена",options:[
        {id:0,value:""},
        {id:1,value:"User2"},
    ]},
]}})

//Модальное окно на редактирование задачи
webix.ui({view:"window",close:true,id:"taskEditModal",position:"center",modal:true,body:{view:"form",id:"editTask",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"name",label:"Имя"},
    {view:"textarea",name:"description",label:"Описание"},
    {view:"text",name:"hours",label:"Кол-во часов"},
    {view:"select",name:"status",label:"Статус",options:helpersModel.StatusOptions},
    {view:"select",name:"type",label:"Тип",options:[
        {id:1,value:"Фича"},
        {id:2,value:"Баг"},
        {id:3,value:"Фикс"},
        {id:4,value:"Тест"},
    ]},
    {view:"select",name:"whom",label:"Кому назначена",options:[
        {id:0,value:""},
        {id:1,value:"User2"},
    ]},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().getValues());
    }}
]}})

//Модальное окно на показ сотрудника
webix.ui({view:"window",close:true,id:"taskShowModal",position:"center",modal:true,body:{view:"form",id:"showTask",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",readonly:true},
    {view:"textarea",name:"Description",label:"Описание",readonly:true},
    {view:"text",name:"Hours",label:"Кол-во часов",readonly:true},
    {view:"text",name:"Status",label:"Статус",readonly:true},
    {view:"text",name:"Type",label:"Тип",readonly:true},
    {view:"text",name:"Perfomer",label:"Кому назначена",readonly:true},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().getValues());
    }}
]}})