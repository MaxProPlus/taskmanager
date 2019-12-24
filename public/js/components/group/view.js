let groupView = {margin:10,
    rows:[
        //Кнопка на добавление группы
        {view:"button", value: "Новая группа",autowidth:true,css:"webix_primary",click:groupComponent.handlerAddGroup},
        {view:"text", placeholder:"Поиск"},
        {view:"datatable",id:"tableGroup", select:true, columns:[
            {id:"Name", header: "Название",fillspace:1},
            {id:"LeaderId", hidden:true},
            {id:"LeaderName", header: "Руководитель",fillspace:2},
        ],url:groupModel.getGroups},
        {view:"toolbar",elements:[
            //Кнопка на просмотр группы
            {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:groupComponent.handlerShowGroup},
            //Кнопка на редактирование группы
            {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:groupComponent.handlerEditGroup},
            //Кнопка на удаление группы
            {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:groupModel.removeGroup},
        ]}
    ]
}
//Модальное окно на создание группы
webix.ui({view:"window",close:true,id:"groupCreateModal",position:"center",modal:true,on:{onShow:groupComponent.handlerShowModal},body:{view:"form",id:"createGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя"},
    {view:"select",name:"LeaderId",label:"Руководитель",options:helpersModel.MembersOptions},
    {view:"select",name:"member_0",label:"Участник",options:helpersModel.MembersOptions},
    {view:"button",value:"Добавить участника",css:"webix_primary",autowidth:true,click:groupComponent.handlerAddMemberCreateModal},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:groupModel.addGroup}
]}})

//Модальное окно на редактирование группы
webix.ui({view:"window",close:true,id:"groupEditModal",position:"center",modal:true,body:{view:"form",id:"editGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя"},
    {view:"select",name:"LeaderId",label:"Руководитель",options:helpersModel.MembersOptions},
    {view:"select",name:"member_0",label:"Участник",options:helpersModel.MembersOptions},
    {view:"button",value:"Добавить участника",css:"webix_primary",autowidth:true,click:groupComponent.handlerAddMemberEditModal},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:groupModel.updateGroup}
]}})

//Модальное окно на просмотр группы
webix.ui({view:"window",close:true,id:"groupShowModal",position:"center",modal:true,body:{view:"form",id:"showGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",readonly:true},
    {view:"text",name:"LeaderName",label:"Руководитель",readonly:true},
    //todo
    // {view:"text",name:"whom",label:"Участник",value:"User2",readonly:true},
]}})