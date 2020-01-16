let groupView = {margin:10,
    rows:[
        //Кнопка на добавление группы
        {cols:[
            {view:"button", value: "Новая группа",autowidth:true,css:"webix_primary",click:groupComponent.handlerModalAdd},
            {},
            {view:"button", value: "Обновить",autowidth:true,css:"webix_primary",click:groupComponent.updateData},
        ]},
        {view:"text", placeholder:"Поиск",on:{onChange:groupComponent.handlerSearch}},
        {view:"datatable",id:"tableGroup",select:true,columns:[
            {id:"Name", header: "Название",sort:"string",fillspace:1},
            {id:"LeaderId", hidden:true},
            {id:"LeaderName", header: "Руководитель",sort:"string",fillspace:2},
        ]},
        {view:"toolbar",elements:[
            //Кнопка на просмотр группы
            {view:"button", value:"Просмотреть",css:"webix_primary",autowidth:true,click:groupComponent.handlerModalShow},
            //Кнопка на редактирование гру0пы
            {view:"button", value:"Редактировать",css:"webix_primary",autowidth:true,click:groupComponent.handlerModalEdit},
            //Кнопка на удаление группы
            {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:groupComponent.handlerDelete},
        ]}
    ]
}

//Модальное окно на создание группы
webix.ui({view:"window",close:true,id:"groupCreateModal",position:"center",modal:true,on:{onShow:groupComponent.handlerShowModal},body:{view:"form",id:"createGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",required:true},
    {view:"select",name:"LeaderId",label:"Руководитель",options:employeeModel.Data,required:true},
    // {view:"select",name:"member_0",label:"Участник",options:employeeModel.Data,required:true},
    {view:"button",value:"Добавить участника",css:"webix_primary",autowidth:true,click:groupComponent.handlerAddMemberCreateModal},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:groupComponent.handlerSaveModalAdd}
]}})

//Модальное окно на редактирование группы
webix.ui({view:"window",close:true,id:"groupEditModal",position:"center",modal:true,body:{view:"form",id:"editGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",required:true},
    {view:"select",name:"LeaderId",label:"Руководитель",options:employeeModel.Data,required:true},
    // {view:"select",name:"member_0",label:"Участник",options:employeeModel.Data,required:true},
    {view:"button",value:"Добавить участника",css:"webix_primary",autowidth:true,click:groupComponent.handlerAddMemberEditModal},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:groupComponent.handlerSaveModalEdit}
]}})

//Модальное окно на просмотр группы
webix.ui({view:"window",close:true,id:"groupShowModal",position:"center",modal:true,body:{view:"form",id:"showGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",readonly:true},
    {view:"text",name:"LeaderName",label:"Руководитель",readonly:true},
]}})