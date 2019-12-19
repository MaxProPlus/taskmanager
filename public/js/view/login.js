webix.ready(function(){
    webix.ui({type:"clean",rows:[
        {height: 40,type:"clean", cols: headerView},
        {align:"center",body:{view:"form",id:"formLogin",elementsConfig:{labelWidth:120},width:300,elements:[
            {view:"text",name:"login",label:"Логин",required:true},
            {view:"text",type:"password",name:"password",label:"Пароль",required:true},
            {view:"button",type:"form",value:"Войти",autowidth:true,css:"webix_primary",click:authModel.login}
        ]}},
    ]})
})