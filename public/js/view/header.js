let headerView = [
    {width:150,type:"header",template: "<div class=\"logo\">Task Manager</div>",onClick:{"logo":function(){window.location="/"}}},
    {},
    {width:150,type:"header",template: "<div class=\"profile\">Выйти</div>",onClick:{"profile":authModel.logout}},
]