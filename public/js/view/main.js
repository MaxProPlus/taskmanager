webix.ready(function(){
    webix.ui({
        rows: [
            {type:"clean", cols: [
                {width:150,type:"header",template: "<div class=\"logo\">Task Manager</div>",onClick:{"logo":function(){window.location="/"}}},
                {},
                {width:150,type:"header",template: "<div class=\"profile\">Profile</div>",onClick:{"profile":function(){window.location="profile"}}},
            ]},
            {view: "tabview", cells: [
                {header:"Задачи", body: taskView},
                {header:"Проекты",body:projectView},
                {header:"Группы",body:groupView},
                {header:"Сотрудники",body:employeeView},
            ]
            },
            
        ],
    })
    // $$('taskModal').show()
    $$('listProject').select(0)
})