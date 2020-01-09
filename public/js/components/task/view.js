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
                {view:"button",value:"Новая задача",autowidth:true,css:"webix_primary",click:taskComponent.handlerAddTask},
                {},
            ]},
            {view:"text",placeholder:"Поиск",on:{onChange:taskComponent.handlerSearchTask}},
            {view:"datatable",id:"tableTask",select:true,columns:[
                {id:"Name",header:"Имя",fillspace:1,sort:"string"},
                {id:"StatusId",hidden:true},
                {id:"StatusName",header:"Статус",sort:"string"},
                {id:"TypeId",hidden:true},
                {id:"TypeName",header:"Тип",sort:"string"},
                {id:"Hours",header:"Время",sort:"int"},
                {id:"PerfomerId",hidden:true},
                {id:"PerfomerName",header:"Назначенно",fillspace:1,sort:"string"},
                {id:"AuthorId",hidden:true},
                {id:"AuthorName",header:"Автор",fillspace:1,sort:"string"},
            ]},
            {view:"toolbar",elements:[
                {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:taskComponent.handlerShowTask},
                {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:taskComponent.handlerEditTask},
                {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:taskModel.deleteTask},
            ]}
        ]}
    ]
}

//Модальное окно на создание задачи
webix.ui({view:"window",close:true,id:"taskCreateModal",position:"center",modal:true,on:{onShow:taskComponent.handlerOnShow},body:{view:"form",id:"createTask",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",required:true},
    {view:"textarea",name:"Description",label:"Описание",required:true},
    {view:"text",name:"Hours",label:"Кол-во часов",required:true},
    {view:"select",name:"StatusId",label:"Статус",options:helpersModel.StatusOptions, required:true},
    {view:"select",name:"TypeId",label:"Тип",options:helpersModel.TypeOptions,required:true},
    {cols:[
        {view:"select",name:"PerfomerId",label:"Кому назначена",options:employeeModel.Data},
        {view:"button",value:"Очистить",css:"webix_primary",autowidth:true,click:taskComponent.handlerClearPerfomer}
    ]},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:taskModel.addTask},
]}})

//Модальное окно на редактирование задачи
webix.ui({view:"window",close:true,id:"taskEditModal",position:"center",modal:true,body:{view:"form",id:"editTask",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",required:true},
    {view:"textarea",name:"Description",label:"Описание",required:true},
    {view:"text",name:"Hours",label:"Кол-во часов",required:true},
    {view:"select",name:"StatusId",label:"Статус",options:helpersModel.StatusOptions,required:true},
    {view:"select",name:"TypeId",label:"Тип",options:helpersModel.TypeOptions,required:true},
    {cols:[
        {view:"select",name:"PerfomerId",label:"Кому назначена",options:employeeModel.Data},
        {view:"button",value:"Очистить",css:"webix_primary",autowidth:true,click:taskComponent.handlerClearPerfomer}
    ]},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:taskModel.updateTask}
]}})

//Модальное окно на показ задачи
webix.ui({view:"window",close:true,id:"taskShowModal",position:"center",modal:true,body:{view:"form",id:"showTask",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",readonly:true},
    {view:"textarea",name:"Description",label:"Описание",readonly:true},
    {view:"text",name:"Hours",label:"Кол-во часов",readonly:true},
    {view:"text",name:"StatusName",label:"Статус",readonly:true},
    {view:"text",name:"TypeName",label:"Тип",readonly:true},
    {view:"text",name:"AuthorName",label:"Автор задачи",readonly:true},
    {view:"text",name:"PerfomerName",label:"Кому назначена",readonly:true},
]}})