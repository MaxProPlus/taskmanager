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
    //Событие на просмотр группы
    handlerShowGroup() {
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

    //Событие на редактирование группы
    handlerEditGroup() {
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
    
    //Событие на кнопку "Добавить группу"
    handlerAddGroup() {
        $$('groupCreateModal').show()//Показать модальное окно
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