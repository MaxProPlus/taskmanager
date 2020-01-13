let employeeView = {margin:10,
    rows: [
        //Кнопка на добавление сотрудника
        {cols:[
            {view:"button", value: "Новый сотрудник",autowidth:true,css:"webix_primary",click:employeeComponent.handlerAddEmployee},
            {},
            {view:"button", value: "Обновить",autowidth:true,css:"webix_primary",click:employeeComponent.updateData},
        ]},
        {view:"text", placeholder:"Поиск",on:{onChange:employeeComponent.handlerSearch}},
        {view:"datatable",id:"tableEmployee",select:true, columns:[
            {id:"Id",hidden:true},
            {id:"Secondname", header: "Фамилия",sort:"string",fillspace:2},
            {id:"Firstname", header: "Имя",sort:"string",fillspace:2},
            {id:"Middlename", header: "Отчество",sort:"string",fillspace:1},
            {id:"PositionId", hidden:true},
            {id:"PositionName", header:"Должность",sort:"string",fillspace:1},
        ]},
        {view:"toolbar",elements:[
            //Кнопка на просмотр сотрудника
            {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:employeeComponent.handlerShowEmployee},

            //Кнопка на редактирование сотрудника
            {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:employeeComponent.handlerEditEmployee},

            //Кнопка на удаление сотрудника
            {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:employeeModel.removeEmployee},
        ]}
    ]
}

//Модальное окно на создание сотрудника
webix.ui({view:"window",close:true,id:"employeeCreateModal",position:"center",modal:true,on:{onShow:employeeComponent.handlerOnShowModal},body:{view:"form",id:"createEmployee",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Secondname",label:"Фамилия",required:true},
    {view:"text",name:"Firstname",label:"Имя",required:true},
    {view:"text",name:"Middlename",label:"Отчество",required:true},
    {view:"select",name:"PositionId",label:"Должность",options:helpersModel.PositionsOptions,required:true},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:employeeModel.addEmployee}
]}})

//Модальное окно на редактирование сотрудника
webix.ui({view:"window",close:true,id:"employeeEditModal",position:"center",modal:true,body:{view:"form",id:"editEmployee",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Id",hidden:true},
    {view:"text",name:"Firstname",label:"Имя",required:true},
    {view:"text",name:"Secondname",label:"Фамилия",required:true},
    {view:"text",name:"Middlename",label:"Отчество",required:true},
    {view:"select",name:"PositionId",label:"Должность",options:helpersModel.PositionsOptions},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:employeeModel.updateEmployee}
]}})

//Модальное окно на показ сотрудника
webix.ui({view:"window",close:true,id:"employeeShowModal",position:"center",modal:true,body:{view:"form",id:"showEmployee",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Firstname",label:"Имя",required:true,readonly:true},
    {view:"text",name:"Secondname",label:"Фамилия",required:true,readonly:true},
    {view:"text",name:"Middlename",label:"Отчество",required:true,readonly:true},
    {view:"text",name:"PositionName",label:"Должность",required:true,readonly:true},
]}})