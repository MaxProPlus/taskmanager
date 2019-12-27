let helpersModel = {
    init() {
        this.PositionsOptionsUpdate()
        this.TypeOptionsUpdate()
        this.StatusOptionsUpdate()
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
    TypeOptions: [],
    TypeOptionsUpdate() {
        let url = '/task_types'
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

            //Заменить значения в TypeOptions
            this.TypeOptions.splice(0,this.TypeOptions.length,...res.Data)
        })
    },
    StatusOptions: [],
    StatusOptionsUpdate() {
        let url = '/task_statuses'
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

            //Заменить значения в StatusOptions
            this.StatusOptions.splice(0,this.StatusOptions.length,...res.Data)
        })
    },
}