const { addUser } = require("../db/userDAO")
const { validateUser } = require("./validateUser")

async function registerUser(user) {
    const newUser = await validateUser(user)
    const add = addUser(newUser)
        .then(() => {
            console.log("User has been registered successfully")
        })
        .catch(() => {
            console.log("Failed to register user")
        })

    return add
}

module.exports = { registerUser }