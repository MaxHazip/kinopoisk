import { Storage } from "./storage.js"

const storage = new Storage

let usersContainer = document.querySelector(".users")

const renderProfiles = () => {

    usersContainer.innerHTML = ""

    let users = storage.getUsers()
    let authUser = storage.getCurrentUser()

    for (let i = 0; i < users.length; i++) {

        if (users[i].id === authUser.id || authUser.friends.includes(users[i].id)) continue

        let userDiv = document.createElement("div")
        userDiv.className = "user"

        let userAvatar = document.createElement("div")
        userAvatar.className = "userAvatar"
        userAvatar.style.backgroundImage = `url(${users[i].avatar})`

        let userName = document.createElement("div")
        userName.className = "userName"
        userName.textContent = users[i].userName

        let addfriend = document.createElement("button")
        addfriend.className = "addfriend"
        addfriend.textContent = "Добавить в друзья"

        addfriend.addEventListener('click', () => {

            storage.addFriend(users[i].id)

            renderProfiles()

        })

        userDiv.appendChild(userAvatar)
        userDiv.appendChild(userName)
        userDiv.appendChild(addfriend)

        usersContainer.appendChild(userDiv)

    }

}

renderProfiles()

const loginButton = document.getElementById("login")

const authUser = storage.getCurrentUser()

if (authUser === null) {

    loginButton.textContent = "Sign in"

} else {

    loginButton.textContent = "Home"

}

loginButton.addEventListener('click', () => {

    if (authUser === null) {

        window.location.href = "../login.html"

    } else {

        window.location.href = "../profile.html"

    }

})