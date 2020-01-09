let authModel = {
    //Выйти
    logout() {
        let url = "/logout"
        let method = "GET"
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type':'application/json;charset=utf-8'
            },
        })
            .then(response => response.json())
            .then(res =>{
                if (res.Result != 0) {
                    webix.message(res.ErrorText)
                } else {
                    window.location = "/login"
                }
            })
    },
    //Войти
    login() {
        if ($$('formLogin').validate()) {
            let user = $$('formLogin').getValues();
            let url = "/auth"
            let method = "POST"
            
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type':'application/json;charset=utf-8'
                },
                body: JSON.stringify(user)
            })
                .then(response => response.json())
                .then(res =>{
                    if (res.Result != 0) {
                        webix.message(res.ErrorText)
                    } else {
                        window.location = "/"
                    }
                })
        }
    }
}