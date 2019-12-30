let adminView = {
    render() {
        webix.ui({margin:10,
            rows: [
                //Кнопка на добавление пользователя
                {view:"button", value: "Новый пользователь",autowidth:true,css:"webix_primary",click:adminComponent.handlerAddUser},
                {view:"text", placeholder:"Поиск",on:{onChange:adminComponent.handlerSearch}},
                {view:"datatable",id:"tableUser",select:true, columns:[
                    {id:"Id",hidden:true},
                    {id:"Login", header: "Логин",sort:"string",fillspace:2},
                    {id:"Password", header: "Пароль",sort:"string",fillspace:2},
                    {id:"IsAdmin", header: "Администратор",sort:"int",fillspace:1},
                    {id:"EmployeeId", hidden:true},
                    {id:"EmployeeName", header:"Сотрудник",sort:"string",fillspace:1},
                ]},
                {view:"toolbar",elements:[
                    //Кнопка на просмотр пользователя
                    {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:adminComponent.handlerShowUser},
        
                    //Кнопка на редактирование пользователя
                    {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:adminComponent.handlerEditUser},
        
                    //Кнопка на удаление пользователя
                    {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:userModel.removeUser},
                ]}
            ]
        })
    }
}

//Модальное окно на создание пользователя
webix.ui({view:"window",close:true,id:"userCreateModal",position:"center",modal:true,on:{onShow:adminComponent.handlerOnShowModal},body:{view:"form",id:"createUser",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Login",label:"Логин",required:true},
    {view:"text",name:"Password",label:"Пароль",required:true},
    {view:"checkbox",name:"IsAdmin",label:"Администратор",required:true},
    {view:"select",name:"EmployeeId",label:"Сотрудник",options:employeeModel.Data,required:true},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:userModel.addUser}
]}})

//Модальное окно на редактирование пользователя
webix.ui({view:"window",close:true,id:"userEditModal",position:"center",modal:true,body:{view:"form",id:"editUser",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Id",hidden:true},
    {view:"text",name:"Login",label:"Логин",required:true},
    {view:"text",name:"Password",label:"Пароль",required:true},
    {view:"checkbox",name:"IsAdmin",label:"Администратор",required:true},
    {view:"select",name:"EmployeeId",label:"Сотрудник",options:employeeModel.Data},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:userModel.updateUser}
]}})

//Модальное окно на показ пользователя
webix.ui({view:"window",close:true,id:"userShowModal",position:"center",modal:true,body:{view:"form",id:"showUser",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Login",label:"Логин",readonly:true},
    {view:"text",name:"Password",label:"Пароль",readonly:true},
    {view:"checkbox",name:"IsAdmin",label:"Администратор",readonly:true},
    {view:"text",name:"EmployeeName",label:"Сотрудник",readonly:true},
]}})