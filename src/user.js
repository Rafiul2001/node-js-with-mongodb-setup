class User {
    constructor(username, password, age, email) {
        this.username = username
        this.password = password
        this.age = age
        this.email = email
        console.log(`New user object of ${username}!`)
    }
}

module.exports = User