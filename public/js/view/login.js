webix.ready(function(){
    webix.ui({type:"clean",rows:[
        {height: 40,type:"clean", cols: [
            {width:150,type:"header",template: "<div class=\"logo\">Task Manager</div>",onClick:{"logo":function(){window.location="/"}}},
            {},
            {width:150,type:"header",template: "<div class=\"profile\">Profile</div>",onClick:{"profile":function(){window.location="profile.html"}}},
        ]},
        {align:"center",body:{view:"form",elementsConfig:{labelWidth:120},width:300,elements:[
            {view:"text",label:"Логин"},
            {view:"text",type:"password",label:"Пароль"},
            {view:"button",value:"Войти",autowidth:true,css:"webix_primary",click:function(){
                webix.message("Сохранено")
            }}
        ]}},
    ]})
})