webix.ready(function(){
    webix.ui({
        rows: [
            {type:"clean", cols: headerView},
            {view: "tabview", cells: [
                {header:"Сотрудники",body:employeeView},
                {header:"Задачи", body: taskView},
                {header:"Проекты",body:projectView},
                {header:"Группы",body:groupView},
            ]
            },
        ],
    })
    // $$('taskModal').show()
    $$('listProject').select(0)
})