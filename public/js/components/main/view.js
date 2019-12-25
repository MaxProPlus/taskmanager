let mainView = {
    render() {
        webix.ui({
            rows: [
                {type:"clean", cols: headerView},
                {view: "tabview", cells: [
                    {header:"Задачи", body: taskView},
                    {header:"Проекты",body:projectView},
                    {header:"Группы",body:groupView},
                    {header:"Сотрудники",body:employeeView},
                ]
                },
            ],
        })
    }
}