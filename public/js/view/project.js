let projectView = {margin:10,
    rows:[
        //Кнопка добавление проекта
        {view:"button", value: "Новый проект",autowidth:true,css:"webix_primary",click:function(){
            $$('projectCreateModal').show()
        }},
        {view:"text", placeholder:"Поиск"},
        {view:"datatable",id:"tableProject",select:true, columns:[
            {id:"Id",hidden:true},
            {id:"Name", header: "Название", fillspace:1,sort:"string"},
            {id:"Description", header: "Описание", fillspace:2,sort:"string"},
            {id:"GroupId", hidden:true,},
            {id:"GroupName", header: "Группа", fillspace:1,sort:"string"},
        ],url:projectModel.getProjects},
        {view:"toolbar",elements:[
            //Кнопка на просмотр сотрудника
            {view:"button", value:"Просмотреть",css:"webix_primary ",autowidth:true,click:function(){
                //Получить выделенный элемент из таблицы
                let el = $$('tableProject').getSelectedItem()
                if (el===undefined)
                    return
                //Записать в форму модального окна полученный элемент из таблицы
                $$('showProject').setValues(el)
                //Показать модальное окно
                $$('projectShowModal').show()
            }},

            //Конпка на редактирование проекта
            {view:"button", value:"Редактировать",css:"webix_primary ",autowidth:true,click:function(){
                //Получить выделенный элемент из таблицы
                let el = $$('tableProject').getSelectedItem()
                if (el===undefined)
                    return
                //Записать в форму модального окна полученный элемент из таблицы
                $$('editProject').setValues(el)
                //Показать модальное окно
                $$('projectEditModal').show()
            }},

            //Кнопка на удаление проекта
            {view:"button", value:"Удалить",css:"webix_danger",autowidth:true,click:projectModel.removeProject},
        ]}
    ]
}

//Модальное окно на создание проекта
webix.ui({view:"window",close:true,id:"projectCreateModal",position:"center",modal:true,on:{onShow:function(_id){
    $$('createProject').clear()//Очистить предыдущие значения
}},body:{view:"form",id:"createProject",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",required:true},
    {view:"textarea",name:"Description",label:"Описание",required:true},
    {view:"select",name:"GroupId",label:"Группа",options:helpersModel.GroupsOptions,required:true},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:projectModel.addProject}
]}})

//Модальное окно на редактирование проекта
webix.ui({view:"window",close:true,id:"projectEditModal",position:"center",modal:true,on:{onShow:function(_id){
    //todo
}},body:{view:"form",id:"editProject",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",required:true},
    {view:"textarea",name:"Description",label:"Описание",required:true},
    {view:"select",name:"GroupId",label:"Группа",options:helpersModel.GroupsOptions,required:true},
    {view:"button",value:"Сохранить",css:"webix_primary",autowidth:true,click:projectModel.updateProject}
]}})

//Модальное окно на показ сотрудника
webix.ui({view:"window",close:true,id:"projectShowModal",position:"center",modal:true,body:{view:"form",id:"showProject",width:500,elementsConfig:{labelWidth:120},elements:[
    {view:"text",name:"Name",label:"Имя",readonly:true},
    {view:"textarea",name:"Description",label:"Описание",readonly:true},
    {view:"text",name:"GroupName",label:"Группа",readonly:true},
]}})