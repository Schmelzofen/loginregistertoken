const dotenv = require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const path = require('path')
const app = express()
var jwt = require('jsonwebtoken')

// JWT
const privateKey = process.env.SECRET
const cookieExp = Math.floor(Date.now() / 1000) + (60 * 60 * 24)

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, '../src/views'))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

// register user
const { registerUser } = require("./service/registerUser")
// login user
const { loginUser } = require("./service/loginUser")


// auth middleware
const authorization = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return res.sendStatus(403)
    }
    try {
        const data = jwt.verify(token, process.env.SECRET)
        req.access_token = data.data
        return next()
    } catch {
        return res.sendStatus(403)
    }
}






app.get("/", (req, res) => {
    res.render("pages/index")
})

app.get("/memberarea", authorization, (req, res) => {
    res.render("pages/memberarea")
})

app.post("/register", (req, res) => {
    const newUser = {
        username: req.body.username.toLowerCase(),
        email: req.body.email,
        password: req.body.password,
    }
    registerUser(newUser)
        .then(() => res.redirect("back"))
})

// LOGIN & LOGOUT
app.post("/login", (req, res) => {
    const user = {
        username: req.body.username.toLowerCase(),
        password: req.body.password
    }
    const loggedUser = loginUser(user)
        .then((user) => {
            const token = jwt.sign({
                exp: cookieExp,
                data: 'auth-token'
            }, privateKey)
            user.access_token = token
            res.cookie("access_token", token)
                .redirect("/")
        })
})

app.get("/logout", authorization, (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .redirect("/")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, function () {
    console.log("Server listening on port " + PORT)
})