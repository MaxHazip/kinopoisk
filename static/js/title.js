import { Storage } from "./storage.js"

const storage = new Storage()

let movies = storage.getMovies()

const movieTitle = document.querySelector(".title_title")
const movieYear = document.querySelector(".title_year")
const moviePoser = document.querySelector(".title_poster")
const genres = document.querySelector(".genres")
const titleAgeLimit = document.querySelector(".title_age_limit")
const runTime = document.querySelector(".title_duration")
const country = document.querySelector(".country")
const director = document.querySelector(".director")
const writers = document.querySelector(".writers")
const producer = document.querySelector(".producer")
const operator = document.querySelector(".operator")
const composer = document.querySelector(".composer")
const artist = document.querySelector(".artist")
const editor = document.querySelector(".editor")
const budget = document.querySelector(".budget")
const boxOffice = document.querySelector(".boxOffice")
const ratings = document.getElementById("rating")
const loginButton = document.getElementById("login")
const submitraiting = document.querySelector(".submitraiting")
const errorAlert = document.querySelector(".error_alert")

const queryString = window.location.search

const urlParams = new URLSearchParams(queryString)

const movieId = urlParams.get("id")

let currentMovie;

for (let i = 0; i < movies.length; i++) {

    if (movies[i].id == movieId) {

        currentMovie = movies[i]
        break

    }

}

movieTitle.textContent = currentMovie.title
movieYear.textContent = currentMovie.year
moviePoser.style.backgroundImage = `url(${currentMovie.img})`
genres.textContent = currentMovie.genres.join(", ")
titleAgeLimit.textContent = currentMovie.ageRating
runTime.textContent =  `${Math.trunc(currentMovie.runtime / 60)}ч ${currentMovie.runtime % 60}м`
country.textContent = currentMovie.country.join(", ")
director.textContent = currentMovie.director.join(", ")
writers.textContent = currentMovie.writers.join(", ")
producer.textContent = currentMovie.producer.join(", ")
operator.textContent = currentMovie.operator.join(", ")
composer.textContent = currentMovie.composer.join(", ")
artist.textContent = currentMovie.artist.join(", ")
editor.textContent = currentMovie.editor.join(", ")

let budgetNum = currentMovie.budget
let boxOfficeNum = currentMovie.boxOffice
const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: "USD", maximumFractionDigits: 0})
budget.textContent = budgetNum === null ? "Неизвестно" :  formatter.format(budgetNum)
boxOffice.textContent = boxOfficeNum === null ? "Неизвестно" :  formatter.format(boxOfficeNum)

let users = storage.getUsers()

const renderAvg = () => {

    ratings.innerHTML = ""

    users = storage.getUsers()

    let sum = 0
    let count = 0  

    for (let i = 0; i < users.length; i++) {
        if (users[i].grades === null || users[i].grades[String(currentMovie.id)] === undefined) {
            continue
        }
        count++
        sum += users[i].grades[String(currentMovie.id)]
    }
    let avg = sum / count
    if (sum === 0) {
        avg = currentMovie.rating
    }

    const avgFormat = Math.trunc((avg * 10)) / 10
    ratings.innerHTML = avgFormat

}

renderAvg()

let authUser = storage.getCurrentUser()

let communityLink = document.getElementById("community")

communityLink.textContent = authUser === null ? "" : "Community"

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

const renderStars = () => {

    submitraiting.innerHTML = ""
    let stars = []

    let currentUser = storage.getCurrentUser()

    for (let i = 0; i < 10; i++) {
        let star = document.createElement("div")
        star.className = "star"
        star.id = `${i+1}`
        
        stars.push(star)

        if (currentUser !== null && currentUser.grades[String(currentMovie.id)] !== undefined && i < currentUser.grades[String(currentMovie.id)]) {
            stars[i].style.backgroundImage = "url(./static/img/Star.svg)"
        } else {
            stars[i].style.backgroundImage = "url(./static/img/black_star.svg)"
        }

        star.addEventListener("click", () => {                        
            
            if (currentUser !== null) {

                storage.saveRaitingCurrentUser(currentUser.id, currentMovie.id, star.id)
                renderStars()                                      
                renderAvg()

            } else {
                errorAlert.textContent = "Зарегестрируйтесь, чтобы поставить оценку"
            }
        })
        submitraiting.appendChild(star)
    }

}

renderStars()

const submitReviewButton = document.getElementById("submit_review")
const titleReviewInput = document.getElementById("review_title")
const textReviewInput = document.getElementById("review_text")
const reviewsContainer = document.getElementById("reviews")

submitReviewButton.addEventListener('click', () => {

    let currentUser = storage.getCurrentUser()

    if (authUser !== null) {
    
        const titleReview = titleReviewInput.value
        const textReview = textReviewInput.value

        storage.saveReview(currentUser.id, currentMovie.id, titleReview, textReview)

        renderReviews()

        titleReviewInput.value = ""
        textReviewInput.value = ""

    } else {
s
        errorAlert.textContent = "Зарегестрируйтесь, чтобы оставить отзыв"

    }

})

const renderReviews = () => {

    reviewsContainer.innerHTML = ""

    let reviews = storage.getReviews()
    users = storage.getUsers()

    for (let i = reviews.length - 1; i >= 0; i--) {
        if (reviews[i].titleId !== currentMovie.id) {
            continue;
        }

        let author

        users.some(element => {
            if (element.id === reviews[i].userId) {
                author = element
                return true
            }
        });

        let reviewContainer = document.createElement("div")
        reviewContainer.className = "reviewContainer"

        let reviewAuthor = document.createElement("h2")
        reviewAuthor.className = "reviewAuthor"
        reviewAuthor.textContent = author.userName

        let reviewTitle = document.createElement("h3")
        reviewTitle.className = "reviewTitle"
        reviewTitle.textContent = reviews[i].title

        let reviewText = document.createElement("p")
        reviewText.className = "reviewText"
        reviewText.textContent = reviews[i].text

        reviewContainer.appendChild(reviewAuthor)
        reviewContainer.appendChild(reviewTitle)
        reviewContainer.appendChild(reviewText)

        reviewsContainer.appendChild(reviewContainer)
    }

}

renderReviews()

const favoriteButton = document.getElementById("favorite_button")

const renderFavotite = () => {

    let authuser = storage.getCurrentUser()

    if (authuser !== null && authUser.favorites.includes(currentMovie.id)) {

        favoriteButton.style.backgroundImage = `url(./static/img/yellow_bookmark.svg)`

    } else {

        favoriteButton.style.backgroundImage = `url(./static/img/black_bookmark.svg)`
        
    }

}

favoriteButton.addEventListener('click', () => {

    let authUser = storage.getCurrentUser()
    let currentMovieIndex = authUser.favorites.indexOf(currentMovie.id)
    let currentMovieId = currentMovie.id

    if (authUser !== null && authUser.favorites.includes(currentMovie.id)) {

        favoriteButton.style.backgroundImage = `url(./static/img/black_bookmark.svg)`          
        storage.deleteFavorite(currentMovieIndex)

    } else {

        favoriteButton.style.backgroundImage = `url(./static/img/yellow_bookmark.svg)`
        storage.saveFavorite(currentMovieId)

    }

})

renderFavotite()