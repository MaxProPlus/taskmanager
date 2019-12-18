let employeeView = {margin:10,
    rows: [
        {view:"button", value: "Новый сотрудник",autowidth:true,css:"webix_primary",click:function(){
            $$('employeeCreateModal').show()
        }},
        {view:"text", placeholder:"Поиск"},
        {view:"datatable",id:"tableEmployee",select:true, columns:[
            {id:"Id",hidden:true},
            {id:"Secondname", header: "Фамилия",fillspace:2},
            {id:"Firstname", header: "Имя",fillspace:2},
            {id:"Middlename", header: "Отчество",fillspace:1},
            {id:"PositionId", hidden:true},
            {id:"PositionName", header:"Должность",fillspace:1}
        ],url:employeeModel.getEmployees},
        {view:"toolbar",elements:[
            {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:function(){
                let el = $$('tableEmployee').getSelectedItem()
                if (el===undefined)
                    return
                $$('showEmployee').setValues(el)
                $$('employeeShowModal').show()
            }},
            {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:function(){
                let el = $$('tableEmployee').getSelectedItem()
                if (el===undefined)
                    return
                $$('editEmployee').setValues(el)
                $$('employeeEditModal').show()
            }},
            {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:employeeModel.removeEmployee},
        ]}
    ]
}
webix.ui({view:"window",close:true,id:"employeeCreateModal",position:"center",modal:true,body:{view:"form",id:"createEmployee",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Secondname",label:"Фамилия",required:true},
    {view:"text",name:"Firstname",label:"Имя",required:true},
    {view:"text",name:"Middlename",label:"Отчество",required:true},
    // {view:"text",name:"Position.Id",hidden:true,required:true},
    // {view:"text",name:"Position.Name",template:"Position.Name",label:"Должность",required:true},
    {view:"select",name:"PositionId",label:"Должность",options:helpersModel.Position},
    // {view:"checkbox",name:"isAdmin", label:"Администратор"},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:employeeModel.addEmployee}
]}})
webix.ui({view:"window",close:true,id:"employeeEditModal",position:"center",modal:true,body:{view:"form",id:"editEmployee",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Id",hidden:true},
    {view:"text",name:"Firstname",label:"Имя",required:true},
    {view:"text",name:"Secondname",label:"Фамилия",required:true},
    {view:"text",name:"Middlename",label:"Отчество",required:true},
    {view:"select",name:"PositionId",label:"Должность",options:helpersModel.Position},
    // {view:"text",name:"PositionName",label:"Должность",required:true},
    // {view:"checkbox",name:"isAdmin", label:"Администратор"},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:employeeModel.updateEmployee}
]}})
webix.ui({view:"window",close:true,id:"employeeShowModal",position:"center",modal:true,body:{view:"form",id:"showEmployee",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Firstname",label:"Имя",required:true,readonly:true},
    {view:"text",name:"Secondname",label:"Фамилия",required:true,readonly:true},
    {view:"text",name:"Middlename",label:"Отчество",required:true,readonly:true},
    {view:"text",name:"PositionName",label:"Должность",required:true,readonly:true},
    // {view:"checkbox",name:"isAdmin", label:"Администратор",readonly:true},
]}})