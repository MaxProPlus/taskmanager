let groupComponent = {
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
        groupModel.getGroupById(el.Id).then(Data=>{
            Data.Members.forEach((el,i)=>{
                Data['member_'+i] = el.Secondname+" "+el.Firstname+" "+el.Middlename
                const member = {id:"showMember_"+i,view:"text",label:"Участник",name:"member_"+i,readonly:true}
                form.addView(
                    member,2
                );
            })
            groupComponent.modalEditMemberCount = Data.Members.length
            form.setValues(Data)
            $$('groupShowModal').show()
        })
    },

    //Событие на редактирование группы
    handlerEditGroup() {
        let el = $$('tableGroup').getSelectedItem()
        if (el===undefined)
            return
        let form = $$('editGroup')
        //Очистка формы
        let child = form.getChildViews()
        for (let i = child.length - 1; i >= 0; i--) {
            if (child[i].config.id.indexOf("editMember_")!=-1) {
                form.removeView(child[i])
            }
        }

        //Добавить значение в форму
        groupModel.getGroupById(el.Id).then(Data=>{
            Data['member_'+0] = Data.Members[0].Id
            for (let i = 1; i < Data.Members.length; i++) {
                Data['member_'+i] = Data.Members[i].Id
                const newMember = {id:"editMember_"+i,cols: [
                    {view:"select",name:"member_"+i,label:"Участник",options:helpersModel.MembersOptions},
                    {view:"button",value:"X",css:"webix_danger",autowidth:true, click:function(){
                        $$('editGroup').removeView(this.getParentView())
                    }},
                ]}
                form.addView(
                    newMember,3
                );
            }
            groupComponent.modalEditMemberCount = Data.Members.length
            form.setValues(Data)
            $$('groupEditModal').show()

        })
    },
    
    //Событие на кнопку "Добавить группу"
    handlerAddGroup() {
        $$('groupCreateModal').show()//Показать модальное окно
    },

    //Событие на кнопку "Просмотреть"
    handlerShowModal() {
        this.modalCreateMemberCount = 1;
        let form = $$('createGroup')
        form.clear()
        let child = form.getChildViews()
        for (let i = child.length - 1; i >= 0; i--) {
            if (child[i].config.id.indexOf("createMember_")!=-1) {
                form.removeView(child[i])
            }
        }
    },

    //Хранит количество участников в форме создание группы
    modalCreateMemberCount:1,

    //Добавить участника в форму создание группы
    handlerAddMemberCreateModal(){
        const newMember = {id:"createMember_"+groupComponent.modalCreateMemberCount,cols: [
            {view:"select",name:"member_"+groupComponent.modalCreateMemberCount,label:"Участник",options:helpersModel.MembersOptions},
            {view:"button",value:"X",css:"webix_danger",autowidth:true, click:function(){
                $$('createGroup').removeView(this.getParentView())
            }},
        ]}
        this.getParentView().addView(
            newMember,3
        );
        groupComponent.modalCreateMemberCount++
    },

    //Хранит количество участников в форме редактирование группы
    modalEditMemberCount: 1,

    //Добавить участника в форму редактирования группы
    handlerAddMemberEditModal(){
        const newMember = {id:"editMember_"+groupComponent.modalEditMemberCount,cols: [
            {view:"select",name:"member_"+groupComponent.modalEditMemberCount,label:"Участник",options:helpersModel.MembersOptions},
            {view:"button",value:"X",css:"webix_danger",autowidth:true, click:function(){
                $$('editGroup').removeView(this.getParentView())
            }},
        ]}
        this.getParentView().addView(
            newMember,3
        );
        groupComponent.modalEditMemberCount++
    }
}