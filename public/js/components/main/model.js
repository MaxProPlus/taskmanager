let helpersModel = {
    PositionsOptions: [],
    PositionsOptionsUpdate() {
        //Запрос на получение списка должностей
        let url = "/positions"
        fetch(url).then(r=>r.json()).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }

            //Обработать значения под options
            res.Data.forEach(el => {
                el.id = el.Id;
                el.value = el.Name;
            });

            //Заменить значения в PositionsOptions
            this.PositionsOptions.splice(0,this.PositionsOptions.length,...res.Data)
        })
    },
    GroupsOptions :[],
    MembersOptions: [],
    StatusOptions: [
        {id:1,value:"Создана"},
        {id:2,value:"Назначена"},
        {id:3,value:"На проверке"},
        {id:4,value:"Выполнена"},
    ]
}