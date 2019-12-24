let groupComponent = {
    handlerShowGroup() {
        let el = $$('tableGroup').getSelectedItem()
        if (el === undefined)
            return
        
        let form = $$('showGroup')
        //Очистка формы
        let child = form.getChildViews()
        for (let i = child.length - 1; i >= 0; i--) {
            if (child[i].config.id.indexOf("showMember_")!=-1) {
                form.removeView(child[i])
            }
        }
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
    handlerAddGroup() {
        $$('groupCreateModal').show()//Показать модальное окно
    },
    handlerDeleteGroup() {

    },
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
    modalCreateMemberCount:1,
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
    modalEditMemberCount: 1,
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