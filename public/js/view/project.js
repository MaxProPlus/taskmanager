let projectView = {margin:10,
    rows:[
        {view:"button", value: "Новый проект",autowidth:true,css:"webix_primary",click:function(){
            $$('projectEditModal').show()
        }},
        {view:"text", placeholder:"Поиск"},
        {view:"datatable",id:"tableProject",select:true, columns:[
            {id:"name", header: "Название", fillspace:1},
            {id:"description", header: "Описание", fillspace:2},
            {id:"group", header: "Группа", fillspace:1},
        ],data:projectModel.getProjects()},
        {view:"toolbar",elements:[
            {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:function(){
                let el = $$('tableProject').getSelectedItem()
                if (el===undefined)
                    return
                // $$('showProject').setValues(el)
                $$('projectShowModal').show()
            }},
            {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:function(){
                let el = $$('tableProject').getSelectedItem()
                if (el===undefined)
                    return
                $$('newProject').setValues(el)
                $$('projectEditModal').show()
            }},
            {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:function(){
                webix.confirm("Удалить проект?").then(function(result){
                    webix.message("Удалено");
                }).fail(function(){
                  webix.message("Отмена");
              });
            }},
        ]}
    ]
}

webix.ui({view:"window",close:true,id:"projectEditModal",position:"center",modal:true,on:{onShow:function(_id){
    //todo
}},body:{view:"form",id:"newProject",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"name",label:"Имя"},
    {view:"textarea",name:"description",label:"Описание"},
    {view:"select",name:"group",label:"Группа",options:[
        {id:1,value:"Группа 1"},
    ]},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().getValues());
    }}
]}})
webix.ui({view:"window",close:true,id:"projectShowModal",position:"center",modal:true,on:{onShow:function(_id){
    //todo
}},body:{view:"form",id:"showProject",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"name",label:"Имя",readonly:true},
    {view:"textarea",name:"description",label:"Описание",readonly:true},
    {view:"text",name:"group",label:"Группа",value:"Группа 1",readonly:true},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().getValues());
    }}
]}})