let groupView = {margin:10,
    rows:[
        //Кнопка на добавление группы
        {view:"button", value: "Новая группа",autowidth:true,css:"webix_primary",click:function(){
            $$('groupCreateModal').show()//Показать модальное окно
        }},
        {view:"text", placeholder:"Поиск"},
        {view:"datatable",id:"tableGroup", select:true, columns:[
            {id:"Name", header: "Название",fillspace:1},
            {id:"LeaderId", hidden:true},
            {id:"LeaderName", header: "Руководитель",fillspace:2},
        ],url:groupModel.getGroups},
        {view:"toolbar",elements:[
            //Кнопка на просмотр группы
            {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:function(){
                let el = $$('tableGroup').getSelectedItem()
                if (el===undefined)
                    return
                $$('showGroup').setValues(el)
                $$('groupShowModal').show()
            }},
            //Кнопка на редактирование группы
            {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:function(){
                let el = $$('tableGroup').getSelectedItem()
                if (el===undefined)
                    return
                $$('newGroup').setValues(el)
                $$('groupEditModal').show()
            }},
            //Кнопка на удаление группы
            {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:groupModel.removeGroup},
        ]}
    ]
}
//Модальное окно на создание группы
let modalCreateMemberCount = 1;
webix.ui({view:"window",close:true,id:"groupCreateModal",position:"center",modal:true,on:{onShow:function(_id){
    modalCreateMemberCount = 1;
    let form = $$('createGroup')
    form.clear()
    let child = form.getChildViews()
    for (let i = child.length - 1; i >= 0; i--) {
        if (child[i].config.id.indexOf("createMember_")!=-1) {
            form.removeView(child[i])
        }
    }
}},body:{view:"form",id:"createGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя"},
    {view:"select",name:"LeaderId",label:"Руководитель",options:[
        {id:1,value:"User1"},
    ]},
    {view:"select",name:"member_0",label:"Участник",options:[
        {id:1,value:"User2"},
    ]},
    {view:"button",value:"Добавить участника",css:"webix_primary",autowidth:true,click:function(){
        const newMember = {id:"createMember_"+modalCreateMemberCount,cols: [
            {view:"select",name:"member_"+modalCreateMemberCount,label:"Участник",options:[
                {id:1,value:"User2"},
            ]},
            {view:"button",value:"X",css:"webix_danger",autowidth:true, click:function(){
                $$('createGroup').removeView(this.getParentView())
            }},
        ]}
        this.getParentView().addView(
            newMember,3
        );
        modalCreateMemberCount++
    }},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:groupModel.addGroup}
]}})

let modalEditMemberCount = 0;
//Модальное окно на редактирование группы
webix.ui({view:"window",close:true,id:"groupEditModal",position:"center",modal:true,body:{view:"form",id:"newGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"name",label:"Имя"},
    {view:"select",name:"owner",label:"Руководитель",options:[
        {id:1,value:"User1"},
    ]},
    {view:"select",name:"whom",label:"Участник",options:[
        {id:1,value:"User2"},
    ]},
    {view:"button",value:"Добавить участника",css:"webix_primary",autowidth:true,click:function(){
        this.getParentView().addView(
            {view:"select",name:"whom",label:"Участник",labelWidth:120,options:[
                {id:1,value:"User2"},
            ]},3
        )
    }},
    {view:"select",name:"project",label:"Проект",options:[
        {id:1,value:"Проект 1"},
    ]},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:function(){
        console.log(this.getParentView().getValues());
    }}
]}})

//Модальное окно на просмотр группы
webix.ui({view:"window",close:true,id:"groupShowModal",position:"center",modal:true,body:{view:"form",id:"showGroup",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",readonly:true},
    {view:"text",name:"LeaderName",label:"Руководитель",readonly:true},
    //todo
    // {view:"text",name:"whom",label:"Участник",value:"User2",readonly:true},
]}})