const connect = require("./conn")

async function getUser() {
    const db = await connect()
    const userList = await db.collection("user")
        .find()
        .toArray()
    return userList
}

async function findUser(query) {
    const db = await connect()
    const userList = await db.collection("user")
        .find(query)
        .toArray()
    return userList
}

async function addUser(user){
    const db = await connect()
    const createdUser = db.collection("user").insertOne(user)
    return createdUser
}

module.exports = {
    getUser,
    findUser,
    addUser,
}