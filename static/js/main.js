import { Storage } from "./storage.js"

const storage = new Storage()


const titles_movies = document.querySelector(".titles_list")
const loginButton = document.getElementById("login")
const searchBox = document.querySelector(".main_content_searchbox")
const filter = document.getElementById("filtres_select")
const sortSelect = document.getElementById("sort_select")

let query = ""
let valueOfFilter = "all"
let methodOf = "casual"

const titles = storage.getMovies()

const renderTitle = (movie) => {

    let movieLowCase = movie.title.toLowerCase()

    if (valueOfFilter !== "all" && !movie.genres.includes(valueOfFilter)) {
        return
    }

    if (query !== "" && !movieLowCase.includes(query)) {
        return
    }

    let title = document.createElement("div")
    title.className = "title"

    let mainLink = document.createElement("a")
    mainLink.style.cursor = "pointer"
    mainLink.addEventListener('click', () => {
        window.location.href = `../title.html?id=${movie.id}`
    })

    let titleImage = document.createElement("div")
    titleImage.className = "title_image"
    titleImage.style.backgroundImage = `url(${movie.img})`

    let titleName = document.createElement("h2")
    titleName.className = "title_name"
    titleName.textContent = movie.title

    let titleYear = document.createElement("p")
    titleYear.className = "year"
    titleYear.textContent = movie.year

    let titleTags = document.createElement("p")
    titleTags.className = "tags"
    titleTags.textContent = movie.genres.join(", ")

    mainLink.appendChild(titleImage)
    mainLink.appendChild(titleName)
    mainLink.appendChild(titleYear)
    mainLink.appendChild(titleTags)
    title.appendChild(mainLink)
    titles_movies.appendChild(title)

}

const renderTitles = (method) => {

    titles_movies.innerHTML = ""

    let currerntUser = storage.getCurrentUser()
    let users = storage.getUsers()

    for (let i = 0; i < titles.length; i++) {
        if (currerntUser !== null && method === "rec") {
            if (!titles[i].genres.every(genre => currerntUser.favGenres.includes(genre)) || currerntUser.favorites.includes(titles[i].id) || !(currerntUser.grades[String(titles[i].id)] === undefined)) {
                continue
            }
        }

        if (currerntUser !== null && method === "friendRec") {

            let friendsFavGenres = []
            for (let j = 0; j < currerntUser.friends.length; j++) {
                let friendIndex = users.findIndex(user => user.id === currerntUser.friends[j])

                users[friendIndex].favGenres.forEach(genre => {

                    if (!friendsFavGenres.includes(genre)) {
                        friendsFavGenres.push(genre)
                    }
                }) 
            }

            if (!titles[i].genres.every(genre => friendsFavGenres.includes(genre)) || currerntUser.favorites.includes(titles[i].id) || !(currerntUser.grades[String(titles[i].id)] === undefined)) {
                continue
            }
            
        }
        
        renderTitle(titles[i])

    }

}

const mainForm = document.getElementById("main_form")

const renderRecomendationButton = () => {

    let authUser = storage.getCurrentUser()

    if (authUser !== null) {
        let recButton = document.createElement("a")
        recButton.id = "recomendationsButton"
        recButton.textContent = "Рекомендации"
        recButton.style.marginRight = "20px"
        recButton.addEventListener("click", () => {
            let friendsRec = document.getElementById("friendsRecomendationsButton")
            methodOf = methodOf === "rec" ? "casual" : "rec"
            if (methodOf === "casual" || methodOf === "friendRec") {
                recButton.textContent = "Рекомендации"
                friendsRec.textContent = "Рекомендации друзей"
            } else {
                recButton.textContent = "Каталог"
                friendsRec.textContent = "Рекомендации друзей"                    
            }
            renderTitles(methodOf)
        })

        mainForm.appendChild(recButton)
    }


}

renderRecomendationButton()

const renderFriendsRecButton = () => {

    let authUser = storage.getCurrentUser()

    if (authUser !== null) {
        let recButton = document.createElement("a")
        recButton.id = "friendsRecomendationsButton"
        recButton.textContent = "Рекомендации друзей"
        recButton.addEventListener("click", () => {
            let rec = document.getElementById("recomendationsButton")
            methodOf = methodOf === "friendRec" ? "casual" : "friendRec"
            if (methodOf === "casual" || methodOf === "rec") {
                recButton.textContent = "Рекомендации друзей"
                rec.textContent = "Рекомендации"
            } else {
                recButton.textContent = "Каталог"
                rec.textContent = "Рекомендации"                    
            }
            renderTitles(methodOf)
        })

        mainForm.appendChild(recButton)
    }


}

renderFriendsRecButton()

let filtersArr = []

const renderFilter = () => {

    for (let i = 0; i < titles.length; i++) {

        for (let j = 0; j < titles[i].genres.length; j++) {

            if (filtersArr.includes(titles[i].genres[j])) {

                continue

            }

            filtersArr.push(titles[i].genres[j])

            let option = document.createElement("option")
            option.value = titles[i].genres[j]
            option.textContent = titles[i].genres[j]
            filter.appendChild(option)

        }

    }

}

filter.onchange = () => {

    valueOfFilter = filter.value

    renderTitles(methodOf)

}

searchBox.addEventListener('input', () => {

    query = searchBox.value.toLowerCase()

    renderTitles(methodOf)

})

const titlesSort = () => {

    switch (sortSelect.value) {

        case "date":            
            titles.sort((first, second) => second.year - first.year)
            break
        case "date-reverse":
            titles.sort((first, second) => first.year - second.year)
            break
        case "alphabet":
            titles.sort((first, second) => first.title.localeCompare(second.title, "ru"))
            break
        case "reverse-alphabet":
            titles.sort((first, second) => second.title.localeCompare(first.title, "ru"))
            break

    }

    renderTitles(methodOf)

}

sortSelect.onchange = () => {

    titlesSort()

}

const authUser = storage.getCurrentUser()

loginButton.textContent = authUser === null ? "Sign in" : "Home" 

let communityLink = document.getElementById("community")

communityLink.textContent = authUser === null ? "" : "Community"

loginButton.addEventListener('click', () => {

    window.location.href = authUser === null ? "../login.html" :  "../profile.html"

})

titlesSort()
renderFilter()