import defaultUsers from "../../data/defaultUsers.json" with {type: 'json'}
import defaultMovies from "../../data/movies.json" with {type: 'json'}
import defaultReviews from "../../data/reviews.json" with {type: 'json'}

export class Storage {

    saveUsers = (users) => {

        localStorage.setItem("users", JSON.stringify(users))

    }

    saveUser = (user, users) => {

        users.push(user)
        this.saveUsers(users)

    }

    getUsers = () => {

        let users = localStorage.getItem("users")

        if (users === null || users === "undefined") {

            this.saveUsers(defaultUsers)
            return defaultUsers            

        } else {
            
            return JSON.parse(users)

        }

    }

    getCurrentUser = () => {
        const currentUser = localStorage.getItem("currentUser")
        if (currentUser) {
            return JSON.parse(currentUser)
        } else {
            return null
        }
    }

    setCurrentUser = (currentUser) => {
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }

    logout = () => {
        localStorage.removeItem("currentUser")
    }

    saveMovies = (movies) => {

        localStorage.setItem("Movies", JSON.stringify(movies))

    }

    getMovies = () => {
        const movies = localStorage.getItem("Movies")
        if (movies !== null) {
            return JSON.parse(movies)
        } else {
            this.saveMovies(defaultMovies)
            return defaultMovies
        }
    }

    saveReviews = (reviews) => {
        localStorage.setItem("Reviews", JSON.stringify(reviews))
    }

    getReviews = () => {
        const reviews = localStorage.getItem("Reviews")
        if (reviews !== null) {
            return JSON.parse(reviews)
        } else {
            this.saveReviews(defaultReviews)
            return defaultReviews
        }
    }

    saveReview = (userId, titleId, title, text) => {
        let reviews = this.getReviews()
        let review = {

            "id": reviews.length + 1,
            "titleId": titleId,
            "userId": userId,
            "title": title,
            "text": text

        }
        reviews.push(review)
        this.saveReviews(reviews)
    }

    saveFavGenres = (userIndex, titleId, users) => {

        let movies = this.getMovies()

        let currentMovie = movies.findIndex(movie => movie.id === titleId)

        movies[currentMovie].genres.forEach(genre => {

            if (!users[userIndex].favGenres.includes(genre)) {

                users[userIndex].favGenres.push(genre)

            }

        })

    }

    saveRaitingCurrentUser = (userId, titleId, value) => {
        let users = this.getUsers()
        let authUser    
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === userId) {
                users[i].grades[String(titleId)] =  Number(value)
                if (Number(value) >= 8) {
                    this.saveFavGenres(i, titleId, users)
                }
                authUser = users[i]
                break
            }
        }
        this.saveUsers(users)
        this.setCurrentUser(authUser)
    }

    saveFavorite = (movieId) => {
        let authUser = this.getCurrentUser()
        let users = this.getUsers()
        let movies = this.getMovies()

        let currentMovieIndex = movies.findIndex((movie) => movie.id === movieId)
        let authUserIndex = users.findIndex((user) => user.id === authUser.id)

        if (authUser !== null) {
            users[authUserIndex].favorites.push(movieId)

            movies[currentMovieIndex].genres.forEach(genre => {
                if (!users[authUserIndex].favGenres.includes(genre)) {
                    users[authUserIndex].favGenres.push(genre)
                }
            });

            authUser = users[authUserIndex]
        } else {
            console.log("Ошибка, пользователь не найден")
        }
        this.saveUsers(users)
        this.setCurrentUser(authUser)
    }

    deleteFavorite = (movieId) => {
        let authUser = this.getCurrentUser()
        let users = this.getUsers()

        let authUserIndex = users.findIndex((user) => user.id === authUser.id)

        if (authUser !== null) {
            users[authUserIndex].favorites.splice(movieId, 1)
            authUser = users[authUserIndex]
        }
        
        this.saveUsers(users)
        this.setCurrentUser(authUser)
    }

    addFriend = (friendId) => {
        let authUser = this.getCurrentUser()
        let users = this.getUsers()
        if (authUser !== null) {
            for (let user of users) {
                if (user.id === authUser.id && !user.friends.includes(friendId)) {
                    user.friends.push(friendId)
                    authUser = user
                }
                if (user.id === friendId) {
                    user.friends.push(authUser.id)
                }
            }
        }
        this.saveUsers(users)
        this.setCurrentUser(authUser)
    }

    deleteFriend = (friendId) => {
        let authUser = this.getCurrentUser()
        let users = this.getUsers()
        if (authUser !== null) {
            for (let user of users) {
                if (user.id === authUser.id && user.friends.includes(friendId)) {
                    let userIndex = user.friends.indexOf(friendId)
                    user.friends.splice(userIndex, 1)
                    authUser = user
                }
                if (user.id === friendId) {
                    let userIndex = user.friends.indexOf(authUser.id)
                    user.friends.splice(userIndex, 1)
                }
            }
        }
        this.saveUsers(users)
        this.setCurrentUser(authUser)
    }

}