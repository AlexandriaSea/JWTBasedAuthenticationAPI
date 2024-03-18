/*
Name: Wenjie Zhou
Student ID: 301337168
Date: 2024-03-18
*/

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const authRoute = require('./routes/authRoute')
const { requireAuth } = require("./utils/utils");

// middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// database connection
const connectionString = process.env.MONGODB_CONNECTION_STRING
mongoose.connect(connectionString)
    .then(res => app.listen(process.env.PORT))
    .catch(err => console.log(err))

// Homepage route
app.get('/', (req, res) => res.json('Welcome to homepage'))

// Admin Portal route
app.get('/adminPortal', requireAuth([1]), (req, res) => {
    res.json('Only admin can see this page')
})

// Student Data route
app.get('/studentData', requireAuth([1, 2]), (req, res) => {
    res.json('Both admin and student can see this page')
})

app.use(authRoute)