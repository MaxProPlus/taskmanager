let projectView = {margin:10,
    rows:[
        //Кнопка добавление проекта
        {cols:[
            {view:"button", value: "Новый проект",autowidth:true,css:"webix_primary",click:projectComponent.handlerModalAdd},
            {},
            {view:"button", value: "Обновить",autowidth:true,css:"webix_primary",click:projectComponent.updateData},
        ]},
        {view:"text", placeholder:"Поиск",on:{onChange:projectComponent.handlerSearch}},
        {view:"datatable",id:"tableProject",select:true, columns:[
            {id:"Id",hidden:true},
            {id:"Name", header: "Название", fillspace:1,sort:"string"},
            {id:"Description", header: "Описание", fillspace:2,sort:"string"},
            {id:"GroupId", hidden:true,},
            {id:"GroupName", header: "Группа", fillspace:1,sort:"string"},
        ]},
        {view:"toolbar",elements:[
            //Кнопка на просмотр сотрудника
            {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:projectComponent.handlerModalShow},

            //Конпка на редактирование проекта
            {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:projectComponent.handlerModalEdit},

            //Кнопка на удаление проекта
            {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:projectComponent.handlerDelete},
        ]}
    ]
}

//Модальное окно на создание проекта
webix.ui({view:"window",close:true,id:"projectCreateModal",position:"center",modal:true,
body:{view:"form",id:"createProject",width:500,elementsConfig:{labelWidth:120},
    elements:[
        {view:"text",name:"Name",label:"Имя",required:true},
        {view:"textarea",name:"Description",label:"Описание",required:true},
        {view:"select",name:"GroupId",label:"Группа",options:groupModel.Data,required:true},
        {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:projectComponent.handlerSaveModalAdd}
]}})

//Модальное окно на редактирование проекта
webix.ui({view:"window",close:true,id:"projectEditModal",position:"center",modal:true,body:{view:"form",id:"editProject",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",required:true},
    {view:"textarea",name:"Description",label:"Описание",required:true},
    {view:"select",name:"GroupId",label:"Группа",options:groupModel.Data,required:true},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:projectComponent.handlerSaveModalEdit}
]}})

//Модальное окно на показ сотрудника
webix.ui({view:"window",close:true,id:"projectShowModal",position:"center",modal:true,body:{view:"form",id:"showProject",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",readonly:true},
    {view:"textarea",name:"Description",label:"Описание",readonly:true},
    {view:"text",name:"GroupName",label:"Группа",readonly:true},
]}})