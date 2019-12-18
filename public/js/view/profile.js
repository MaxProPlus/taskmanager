webix.ready(function(){
    webix.ui({type:"clean",rows:[
        {height: 40,type:"clean", cols: viewHeader},
        {align:"center",body:{view:"form",elementsConfig:{labelWidth:120},width:300,elements:[
            {view:"button",value:"Выйти",autowidth:true,css:"webix_primary",click:function(){
                window.location="/login"
                //webix.message("logout")
            }}
        ]}},
        {align:"center",body:{view:"form",elementsConfig:{labelWidth:120},width:300,elements:[
            {view:"text",label:"Старый логин"},
            {view:"text",label:"Новый логин"},
            {view:"button",value:"Сохранить",autowidth:true,css:"webix_primary",click:function(){
                webix.message("Сохранено")
            }}
        ]}},
        {align:"center",body:{view:"form",elementsConfig:{labelWidth:120},width:300,elements:[
            {view:"text",type:"password",label:"Старый пароль"},
            {view:"text",type:"password",label:"Новый пароль"},
            {view:"text",type:"password",label:"Повтор"},
            {view:"button",value:"Сохранить",autowidth:true,css:"webix_primary",click:function(){
                webix.message("Сохранено")
            }}
        ]}},
        
        
    ]})
})