const { findUser } = require("../db/userDAO")
var jwt = require('jsonwebtoken')
const crypto = require('crypto')

async function loginUser(user) {
    let foundUser
    const getUser = await findUser({ username: user.username })
        .then((result) => {
            foundUser = result
        })
        .catch(() => {
            throw new Error("User not found")
        })
    if (foundUser.length == 0) {
        throw new Error("User not found")
    }
    // validate hash
    const newHash = crypto.pbkdf2Sync(user.password, process.env.SALT, 1000, 64, 'sha512').toString('hex')
    if (newHash == foundUser[0].password) {
        console.log("Hash and username matches")
    }
    return foundUser
}

module.exports = {
    loginUser
}