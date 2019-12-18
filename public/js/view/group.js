let groupView = {margin:10,
    rows:[
        {view:"button", value: "Новая группа",autowidth:true,css:"webix_primary",click:function(){
            $$('groupEditModal').show()
        }},
        {view:"text", placeholder:"Поиск"},
        {view:"datatable",id:"tableGroup", select:true, columns:[
            {id:"name", header: "Название",fillspace:1},
            {id:"admin", header: "Руководитель",fillspace:2},
            {id:"project", header: "Проект",fillspace:1},
        ],data:groupModel.getGroups()},
        {view:"toolbar",elements:[
            {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:function(){
                let el = $$('tableGroup').getSelectedItem()
                if (el===undefined)
                    return
                // $$('showGroup').setValues(el)
                $$('groupShowModal').show()
            }},
            {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:function(){
                let el = $$('tableGroup').getSelectedItem()
                if (el===undefined)
                    return
                $$('newGroup').setValues(el)
                $$('groupEditModal').show()
            }},
            {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:function(){
                webix.confirm("Удалить группу?").then(function(result){
                    webix.message("Удалено");
                }).fail(function(){
                  webix.message("Отмена");
              });
            }},
        ]}
    ]
}
webix.ui({view:"window",close:true,id:"groupEditModal",position:"center",modal:true,on:{onShow:function(_id){
    // this.clear()
}},body:{view:"form",id:"newGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"name",label:"Имя"},
    {view:"select",name:"owner",label:"Руководитель",options:[
        {id:1,value:"User1"},
    ]},
    {view:"select",name:"whom",label:"Участник",options:[
        {id:1,value:"User2"},
    ]},
    {view:"button",value:"Добавить участника",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().addView(
            {view:"select",name:"whom",label:"Участник",labelWidth:120,options:[
                {id:1,value:"User2"},
            ]},3
        ));
    }},
    {view:"select",name:"project",label:"Проект",options:[
        {id:1,value:"Проект 1"},
    ]},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().getValues());
    }}
]}})
webix.ui({view:"window",close:true,id:"groupShowModal",position:"center",modal:true,on:{onShow:function(_id){
    // this.clear()
}},body:{view:"form",id:"showGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"name",label:"Имя",readonly:true},
    {view:"text",name:"owner",label:"Руководитель",value:"User1",readonly:true},
    {view:"text",name:"whom",label:"Участник",value:"User2",readonly:true},
    
    
    {view:"text",name:"project",label:"Проект",value:"Проект 1",readonly:true},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().getValues());
    }}
]}})