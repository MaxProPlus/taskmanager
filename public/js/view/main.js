webix.ready(function(){
    helpersModel.init();
    webix.ui({
        rows: [
            {type:"clean", cols: headerView},
            {view: "tabview", cells: [
                {header:"Группы",body:groupView},
                {header:"Задачи", body: taskView},
                {header:"Проекты",body:projectView},
                {header:"Сотрудники",body:employeeView},
            ]
            },
        ],
    })
    // $$('taskModal').show()
    $$('listProject').select(0)
})