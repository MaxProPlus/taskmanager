let helpersModel = {
    init() {
        this.PositionsOptionsUpdate()
        this.GroupsOptionsUpdate()
        this.MembersOptionsUpdate()
    },
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
    GroupsOptionsUpdate() {
        //Запрос на получение списка групп
        let url = "/groups"
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

            //Заменить значения в GroupsOptions
            this.GroupsOptions.splice(0,this.GroupsOptions.length,...res.Data)
        })
    },
    MembersOptions: [],
    MembersOptionsUpdate() {
        //Запрос на получение списка сотрудников
        let url = "/employees"
        fetch(url).then(r=>r.json()).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }

            //Обработать значения под options
            res.Data.forEach(el=>{
                el.id = el.Id;
                el.value = el.Secondname+" "+el.Firstname+" "+el.Middlename
            })

            //Заменить значения в MembersOptions
            this.MembersOptions.splice(0,this.MembersOptions.length,...res.Data)
        })
    }
}