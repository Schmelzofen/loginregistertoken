var validator = require('validator')
const crypto = require('crypto')
const { findUser } = require("../db/userDAO")

async function validateUser(user) {
    const mailValid = validator.isEmail(user.email)
    if (!mailValid) {
        throw new Error('Please enter a valid email address.')
    }
    if (user.password[0] != user.password[1] || user.password[0].length < 6) {
        throw new Error("Password does not match or something else is wrong with it.")
    }
    if (user.password[0] === user.password[1]) {
        user.password = user.password[0]
        const password = user.password
        const salt = process.env.SALT
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
        user.password = hash
    }
    const findByMail = await findUser({ email: user.email })
        .then((result) => {
            if (result.length > 0) {
                throw new Error("Email address already exists")
            }
        })
    console.log("Mail is unique and password does match")
    return user
}

module.exports = {
    validateUser
}