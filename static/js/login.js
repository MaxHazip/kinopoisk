import { Storage } from "./storage.js"

const storage = new Storage()

let users = storage.getUsers()

const submitButton = document.getElementById("submit")

const inputsContainer = document.getElementById("login_input")
const switchButton = document.getElementById("switch_button")
const alert = document.getElementById("alert")

const renderLoginPage = (isLoginPage) => {

    inputsContainer.innerHTML = ""

    if (!isLoginPage) {
        let name = document.createElement("input")
        name.type = "text"
        name.className = "name textfield"
        name.placeholder = "Name..."  
        inputsContainer.appendChild(name)  
    }

    let login = document.createElement("input")
    login.type = "email"
    login.className = "email textfield"
    login.placeholder = "Email..."
    let password = document.createElement("input")
    password.type = "password"
    password.className = "password textfield"
    password.placeholder = "Password..."
    
    switchButton.innerHTML = isLoginPage ? "Регистрация" : "Вход"
    submitButton.innerHTML = isLoginPage ? "Войти" : "Зарегестрироваться"
    submitButton.className = isLoginPage ? "login" : "registration"

    inputsContainer.appendChild(login)
    inputsContainer.appendChild(password)


}

let isLoginPage = true

switchButton.addEventListener('click', () => {

    
    isLoginPage = !isLoginPage


    renderLoginPage(isLoginPage)

})

submitButton.addEventListener('click', () => {

    const loginInput = document.querySelector(".email")
    const passwordInput = document.querySelector(".password")

    let loginValue = loginInput.value
    let passwordValue = passwordInput.value

    if (submitButton.className === "registration") {

        const nameInput = document.querySelector(".name")
        let nameValue = nameInput.value 
        let isValidLogin = true

        for (let i = 0; i < users.length; i++) {
            if (loginValue === users[i].email) {
                isValidLogin = false
                break
            }
        }

        if (isValidLogin) {
            let user = {
                "id": users.length + 1,
                "userName": nameValue,
                "email": loginValue,
                "password": passwordValue,
                "friends": [],
                "avatar": "",
                "favorites": [],
                "reviews": [],
                "grades": {},
                "favGenres": []
            }

            storage.saveUser(user, users)

            isLoginPage = true

            renderLoginPage(isLoginPage)

        } else {            
            alert.textContent = "Почта уже занята"
        }

    } else {

        let isValidLogin = false
        let userIndex = 0

        for (let i = 0; i < users.length; i++) {
            if (loginValue === users[i].email) {
                isValidLogin = true
                userIndex = i
                break
            }
        }

        if (isValidLogin && passwordValue === users[userIndex].password) {

            storage.setCurrentUser(users[userIndex])
            window.location.href = "profile.html"

        } else {

            alert.textContent = "Неверный логин или пароль"

        }

    }

})

renderLoginPage(isLoginPage)