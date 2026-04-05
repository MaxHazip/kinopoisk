import { Storage } from "./storage.js"

const storage = new Storage()

let movies = storage.getMovies()


const logoutButton = document.getElementById("logout")

const profileName = document.querySelector(".profile_name")
const friendsCount = document.querySelector(".friends_count")
const filmsCount = document.querySelector(".films_count")
const profileImage = document.querySelector(".profile_image")
const titlesDiv = document.getElementById("titles")


const currentUser = storage.getCurrentUser()


logoutButton.addEventListener('click', () => {

    storage.logout()

    window.location.href = "index.html"

})

profileName.textContent = currentUser.userName
friendsCount.textContent = currentUser.friends.length
filmsCount.textContent = currentUser.favorites.length
profileImage.style.backgroundImage = `url(${currentUser.avatar})`

const renderMovies = () => {

    titlesDiv.innerHTML = ""

    let moviesContainer = document.createElement("div")
    moviesContainer.className = "graidsContainer"
    moviesContainer.style.display = "grid"
    moviesContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr"
    moviesContainer.style.width = "95%"
    moviesContainer.style.margin = "0 auto"
    moviesContainer.style.rowGap = "20px"
    

    for (let i = 0; i < movies.length; i++) {

        if (!currentUser.favorites.includes(movies[i].id)) {

            continue;

        }

        let title = document.createElement("div")
        title.className = "title"

        let mainLink = document.createElement("a")
        mainLink.style.cursor = "pointer"
        mainLink.addEventListener('click', () => {            
            window.location.href = `title.html?id=${movies[i].id}`
        })

        let titleImage = document.createElement("div")
        titleImage.className = "title_image"
        titleImage.style.backgroundImage = `url(${movies[i].img})`

        let titleName = document.createElement("h2")
        titleName.className = "title_name"
        titleName.textContent = movies[i].title

        let titleYear = document.createElement("p")
        titleYear.className = "year"
        titleYear.textContent = movies[i].year

        let titleTags = document.createElement("p")
        titleTags.className = "tags"
        titleTags.textContent = movies[i].genres.join(", ")

        mainLink.appendChild(titleImage)
        mainLink.appendChild(titleName)
        mainLink.appendChild(titleYear)
        mainLink.appendChild(titleTags)
        title.appendChild(mainLink)
        moviesContainer.appendChild(title)
        titlesDiv.appendChild(moviesContainer)

    }

}

const renderReviews = () => {

    titlesDiv.innerHTML = ""

    let reviews = storage.getReviews()

    for (let i = 0; i < reviews.length; i++) {

        if (currentUser.id !== reviews[i].userId) {

            continue;

        }

        let reviewContainer = document.createElement("div")
        reviewContainer.className = "reviewContainer"

        let titleName = document.createElement("h2")
        titleName.className = "titleName"
        titleName.textContent = movies[reviews[i].titleId].title

        let reviewTitle = document.createElement("h3")
        reviewTitle.className = "reviewTitle"
        reviewTitle.textContent = reviews[i].title

        let reviewText = document.createElement("p")
        reviewText.className = "reviewText"
        reviewText.textContent = reviews[i].text

        reviewContainer.appendChild(titleName)
        reviewContainer.appendChild(reviewTitle)
        reviewContainer.appendChild(reviewText)

        titlesDiv.appendChild(reviewContainer)

    }

}

const renderGraids = () => {

    titlesDiv.innerHTML = ""

    let graidsContainer = document.createElement("div")
    graidsContainer.className = "graidsContainer"
    graidsContainer.style.display = "grid"
    graidsContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr"
    graidsContainer.style.width = "95%"
    graidsContainer.style.margin = "0 auto"
    graidsContainer.style.rowGap = "20px"

    for (let i = 0; i < movies.length; i++) {

        if (currentUser.grades[String(movies[i].id)] === undefined) {
            continue;
        }

        let currentMovieGrade = currentUser.grades[String(movies[i].id)]
        let title = document.createElement("div")
        title.className = "title"

        let mainLink = document.createElement("a")
        mainLink.style.cursor = "pointer"
        mainLink.addEventListener('click', () => {            
            window.location.href = `title.html?id=${movies[i].id}`
        })

        let titleImage = document.createElement("div")
        titleImage.className = "title_image"
        titleImage.style.backgroundImage = `url(${movies[i].img})`

        let titleName = document.createElement("h2")
        titleName.className = "title_name"
        titleName.textContent = movies[i].title

        let titleYear = document.createElement("p")
        titleYear.className = "year"
        titleYear.textContent = movies[i].year

        let raiting = document.createElement("div")
        raiting.className = "raiting"

        for (let i = 0; i < currentMovieGrade; i++) {

            let star = document.createElement("div")
            star.className = "raitingStar"
            raiting.appendChild(star)
        }
        
        mainLink.appendChild(titleImage)
        mainLink.appendChild(titleName)
        mainLink.appendChild(titleYear)
        mainLink.appendChild(raiting)

        title.appendChild(mainLink)
        graidsContainer.appendChild(title)
        titlesDiv.appendChild(graidsContainer)
    }

}

const renderFriends = () => {

    titlesDiv.innerHTML = ""

    let users = storage.getUsers()
    let authUser = storage.getCurrentUser()

    let friendsContainer = document.createElement("div")
    friendsContainer.className = "graidsContainer"
    friendsContainer.style.display = "grid"
    friendsContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr"
    friendsContainer.style.width = "95%"
    friendsContainer.style.margin = "0 auto"
    friendsContainer.style.rowGap = "20px"

    for (let i = 0; i < users.length; i++) {

        if (users[i].id === authUser.id || !authUser.friends.includes(users[i].id)) continue

        let userDiv = document.createElement("div")
        userDiv.className = "user"

        let userAvatar = document.createElement("div")
        userAvatar.className = "userAvatar"
        userAvatar.style.backgroundImage = `url(${users[i].avatar})`

        let userName = document.createElement("div")
        userName.className = "userName"
        userName.textContent = users[i].userName

        let deletefriend = document.createElement("button")
        deletefriend.className = "deletefriend"
        deletefriend.textContent = "Удалить из друзей"

        deletefriend.addEventListener('click', () => {

            storage.deleteFriend(users[i].id)

            let authUser = storage.getCurrentUser()
            
            friendsCount.textContent = authUser.friends.length

            renderFriends()

        })

        userDiv.appendChild(userAvatar)
        userDiv.appendChild(userName)
        userDiv.appendChild(deletefriend)

        friendsContainer.appendChild(userDiv)
        titlesDiv.appendChild(friendsContainer)

    }

}

const raitingsCategory = document.querySelector(".raitings-category")
const filmsButton = document.querySelector(".films-category")
const reviewsButton = document.querySelector(".reviews-category")
const friendsButton = document.querySelector(".friends-category")

filmsButton.style.color = "#f39c12"

filmsButton.addEventListener('click', () => {

    filmsButton.style.color = "#f39c12"
    raitingsCategory.style.color = "#5a6f7e"
    reviewsButton.style.color = "#5a6f7e"
    friendsButton.style.color = "#5a6f7e"
    renderMovies()

})

reviewsButton.addEventListener('click', () => {

    filmsButton.style.color = "#5a6f7e"
    raitingsCategory.style.color = "#5a6f7e"
    reviewsButton.style.color = "#f39c12"
    friendsButton.style.color = "#5a6f7e"

    renderReviews()

})

raitingsCategory.addEventListener('click', () => {

    filmsButton.style.color = "#5a6f7e"
    raitingsCategory.style.color = "#f39c12"
    reviewsButton.style.color = "#5a6f7e"
    friendsButton.style.color = "#5a6f7e"
    renderGraids()

})

friendsButton.addEventListener('click', () => {

    filmsButton.style.color = "#5a6f7e"
    raitingsCategory.style.color = "#5a6f7e"
    reviewsButton.style.color = "#5a6f7e"
    friendsButton.style.color = "#f39c12"
    renderFriends()

})

renderMovies()

