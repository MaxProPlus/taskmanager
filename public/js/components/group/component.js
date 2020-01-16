let groupComponent = {
    //Обновить данные в таблице
    updateData() {
        groupModel.getGroups().then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return Promise.reject(res.ErrorText)
            }
            let table = $$('tableGroup')
            
            //Обработать значения под таблицу
            res.Data.forEach(el => {
                el.LeaderId = el.Leader.Id
                el.LeaderName = el.Leader.Secondname+" "+el.Leader.Firstname+" "+el.Leader.Middlename
                el.id = el.Id;
                el.value = el.Name;
            });
            //Записать ответ в groupModel
            groupModel.Data.splice(0,groupModel.Data.length,...res.Data)
            //Записать ответ в таблицу
            table.clearAll()
            table.define("data", res.Data)
            table.refresh()
        })
    },
    //Событие на поиск групп
    handlerSearch(value) {
        if (!value) return $$('tableGroup').filter();

        $$('tableGroup').filter(function(obj){
            return obj.Name.indexOf(value) !== -1;
        })
    },
    
    //Окно добавления
    handlerModalAdd() {
        $$('groupCreateModal').show()//Показать модальное окно
    },
    //Окно просмотра
    handlerModalShow() {
        //Получить выделенный элемент таблицы
        let el = $$('tableGroup').getSelectedItem()
        if (el === undefined)
            return
        
        //Ссылка на форму
        let form = $$('showGroup')
        //Очистка формы
        let child = form.getChildViews()
        for (let i = child.length - 1; i >= 0; i--) {
            if (child[i].config.id.indexOf("showMember_")!=-1) {
                form.removeView(child[i])
            }
        }

        //Заполнить данные в форму
        groupModel.getGroupById(el.Id).then(res=>{
            res.Data.LeaderId = res.Data.Leader.Id
            res.Data.LeaderName = res.Data.Leader.Secondname+" "+res.Data.Leader.Firstname+" "+res.Data.Leader.Middlename
            res.Data.Members.forEach((el,i)=>{
                res.Data['member_'+i] = el.Secondname+" "+el.Firstname+" "+el.Middlename
                const member = {id:"showMember_"+i,view:"text",label:"Участник",name:"member_"+i,readonly:true}
                form.addView(
                    member,2
                );
            })
            groupComponent.modalEditMemberCount = res.Data.Members.length
            form.setValues(res.Data)
            $$('groupShowModal').show()
        })
    },
    //Окно редактирования
    handlerModalEdit() {
        let el = $$('tableGroup').getSelectedItem()
        if (el===undefined)
            return
        let form = $$('editGroup')
        //Обновляет select
        form.getChildViews().find(el=>(el.config.name == "LeaderId")?true:false).refresh()
        //Очистка формы
        let child = form.getChildViews()
        for (let i = child.length - 1; i >= 0; i--) {
            if (child[i].config.id.indexOf("editMember_")!=-1) {
                form.removeView(child[i])
            }
        }

        //Добавить значение в форму
        groupModel.getGroupById(el.Id).then(res=>{
            if (res.Result != 0) {
                webix.message(res.ErrorText)
                return
            }
            res.Data.LeaderId = res.Data.Leader.Id
            res.Data.LeaderName = res.Data.Leader.Secondname+" "+res.Data.Leader.Firstname+" "+res.Data.Leader.Middlename

            if (res.Data.Members.length>0) {
                for (let i = 0; i < res.Data.Members.length; i++) {
                    res.Data['member_'+i] = res.Data.Members[i].Id
                    const newMember = {id:"editMember_"+i,cols: [
                        {view:"select",name:"member_"+i,label:"Участник",options:employeeModel.Data},
                        {view:"button",value:"X",css:"webix_danger",autowidth:true, click:function(){
                            $$('editGroup').removeView(this.getParentView())
                        }},
                    ]}
                    form.addView(
                        newMember,2
                    );
                }
            }
            groupComponent.modalEditMemberCount = res.Data.Members.length
            form.setValues(res.Data)
            $$('groupEditModal').show()

        })
    },
    //Кнопка сохранить у окна создания
    handlerSaveModalAdd() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить сущность
            let group = this.getParentView().getValues()
            
            //Обработать объект для передачи серверу
            group.Leader = {
                Id: parseInt(group.LeaderId),
            }
            group.Members = []
            for (let key in group) {
                if (key.indexOf("member_")!=-1) {
                    group.Members.push({
                        Id: parseInt(group[key])
                    })
                }
            }

            //Запрос на добавление группы
            groupModel.add(group).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return Promise.reject(res.ErrorText)
                }

                //Обработать значение под таблицу
                res.Data.LeaderId = res.Data.Leader.Id
                res.Data.LeaderName = res.Data.Leader.Secondname+" "+res.Data.Leader.Firstname+" "+res.Data.Leader.Middlename
                res.Data.id = res.Data.Id
                res.Data.value = res.Data.Name

                //Добавить значение в массив сущностей
                groupModel.Data.push(res.Data)
                //Добавить группу в таблицу
                let table = $$('tableGroup')
                table.add(res.Data)
                table.select(res.Data.id)
                webix.message("Группа добавлена")
                $$('groupCreateModal').hide()
            })
        }
    },
    //Кнопка сохранить у окна редактирования
    handlerSaveModalEdit() {
        //Проверить валидацию полей
        if (this.getParentView().validate()) {
            //Получить значение
            let group = this.getParentView().getValues()

            //Обработать объект для передачи серверу
            group.Leader = {
                Id: parseInt(group.LeaderId),
            }

            group.Members = []

            for (let key in group) {
                if (key.indexOf("member_")!=-1) {
                    group.Members.push({
                        Id: parseInt(group[key])
                    })
                }
            }

            //Запрос на обновление группы
            groupModel.update(group).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }

                //Обработать значение под таблицу
                res.Data.LeaderId = res.Data.Leader.Id
                res.Data.LeaderName = res.Data.Leader.Secondname+" "+res.Data.Leader.Firstname+" "+res.Data.Leader.Middlename
                res.Data.id = res.Data.Id
                res.Data.value = res.Data.Name

                indexGroup = groupModel.Data.findIndex(el=>el.Id==res.Data.Id)
                groupModel.Data[indexGroup] = res.Data

                //Обновить элемент в таблице
                let el = $$('tableGroup').getSelectedItem()
                $$('tableGroup').updateItem(el.id, res.Data)
                webix.message("Группа обновлена")
                $$('groupEditModal').hide()
            })
        }
    },
    //Кнопка "Удалить"
    handlerDelete() {
        //Получить выделенный элемент
        let el = $$('tableGroup').getSelectedItem()
        if (el === undefined)
            return

        webix.confirm("Удалить группу?").then(function (result) {
            //Запрос на удаление группы
            groupModel.delete(el.Id).then(res => {
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                    return
                }

                //Удалить объект из массива сущностей
                indexGroup = groupModel.Data.findIndex(elem=>elem.Id==el.Id)
                groupModel.Data.splice(indexGroup,1)
                //Удалить элемент из таблицы
                $$('tableGroup').remove(el.id)
                $$('tableGroup').refresh()
                webix.message("Удалено");
            })
        });
    },

    //Событие на показ модального окна при создании сотрудника
    handlerShowModal() {
        //Сбрасывает количество участников
        this.modalCreateMemberCount = 0;
        let form = $$('createGroup')

        //Удаляет поля участников
        let child = form.getChildViews()
        for (let i = child.length - 1; i >= 0; i--) {
            if (child[i].config.id.indexOf("createMember_")!=-1) {
                form.removeView(child[i])
            }
        }

        //Обновляет select
        form.getChildViews().find(el=>(el.config.name == "LeaderId")?true:false).refresh()
        //Очищает форму
        form.clear()
    },

    //Хранит количество участников в форме создание группы
    modalCreateMemberCount:0,

    //Добавить участника в форму создание группы
    handlerAddMemberCreateModal(){
        const newMember = {id:"createMember_"+groupComponent.modalCreateMemberCount,cols: [
            {view:"select",name:"member_"+groupComponent.modalCreateMemberCount,label:"Участник",options:employeeModel.Data},
            {view:"button",value:"X",css:"webix_danger",autowidth:true, click:function(){
                $$('createGroup').removeView(this.getParentView())
            }},
        ]}
        this.getParentView().addView(
            newMember,2
        );
        groupComponent.modalCreateMemberCount++
    },

    //Хранит количество участников в форме редактирование группы
    modalEditMemberCount: 0,

    //Добавить участника в форму редактирования группы
    handlerAddMemberEditModal(){
        const newMember = {id:"editMember_"+groupComponent.modalEditMemberCount,cols: [
            {view:"select",name:"member_"+groupComponent.modalEditMemberCount,label:"Участник",options:employeeModel.Data},
            {view:"button",value:"X",css:"webix_danger",autowidth:true, click:function(){
                $$('editGroup').removeView(this.getParentView())
            }},
        ]}
        this.getParentView().addView(
            newMember,2
        );
        groupComponent.modalEditMemberCount++
    }

}