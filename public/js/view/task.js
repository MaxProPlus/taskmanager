let taskView = {
    cols: [
        {margin:5,rows: [
            {template:"Проекты", type:"header"},
            {view:"button", value: "Новый проект",autowidth:true,css:"webix_primary",click:function(){
                $$('projectModal').show()
            }},
            {view:"text", placeholder:"Поиск",on:{onChange:function(newv){
                if (!newv) return $$('listProject').filter();

                $$('listProject').filter(function(obj){
                    return obj.title.indexOf(newv) !== -1;
                })
            }}},
            {view:"list",id:"listProject",select: true,template:"#Name#",url:projectModel.getProjects},
        ]},
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
            {view:"text",placeholder:"Поиск",on:{onChange:function(newv){
                if (!newv) return $$('tableTask').filter();

                $$('tableTask').filter(function(obj){
                    return obj.name.indexOf(newv) !== -1;
                })
            }}},
            {view:"datatable",id:"tableTask",select:true,columns:[
                {id:"name",header:"Имя",fillspace:1},
                {id:"status",header:"Статус"},
                {id:"type",header:"Тип"},
                {id:"hours",header:"Время"},
                {id:"whom",header:"Назначенно",fillspace:1},
                {id:"author",header:"Автор",fillspace:1},
            ],data:taskModel.getTasks()},
            {view:"toolbar",elements:[
                {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:function(){
                    let el = $$('tableTask').getSelectedItem()
                    if (el===undefined)
                        return
                    $$('showTask').setValues(el)
                    $$('taskShowModal').show()
                }},
                {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:function(){
                    let el = $$('tableTask').getSelectedItem()
                    if (el===undefined)
                        return
                    $$('newTask').setValues(el)
                    $$('taskEditModal').show()
                }},
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
webix.ui({view:"window",close:true,id:"taskEditModal",position:"center",modal:true,on:{onShow:function(_id){
    //todo
}},body:{view:"form",id:"newTask",width:500,elementsConfig:{labelWidth:120},elements:[
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
    {view:"select",name:"project",label:"Проект",options:[
        {id:1,value:"Проект 1"},
    ]},
    {view:"select",name:"whom",label:"Кому назначена",options:[
        {id:0,value:""},
        {id:1,value:"User2"},
    ]},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().getValues());
    }}
]}})
webix.ui({view:"window",close:true,id:"taskShowModal",position:"center",modal:true,on:{onShow:function(_id){
    //todo
}},body:{view:"form",id:"showTask",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"name",label:"Имя",readonly:true},
    {view:"textarea",name:"description",label:"Описание",readonly:true},
    {view:"text",name:"hours",label:"Кол-во часов",readonly:true},
    {view:"text",name:"status",label:"Статус",readonly:true},
    
    {view:"text",name:"type",label:"Тип",readonly:true},
    {view:"text",name:"project",label:"Проект",readonly:true},
    {view:"text",name:"whom",label:"Кому назначена",readonly:true},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().getValues());
    }}
]}})