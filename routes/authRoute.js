/*
Name: Wenjie Zhou
Student ID: 301337168
Date: 2024-03-18
*/

const { Router } = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user');
const { createToken } = require('../utils/utils');


// Get to signup page
router.get('/signup', (req, res) => res.json('Welcome to Signup Page'))

// Post to signup and create new accounts
router.post('/signup', async (req, res) => {
    try {
        const { role, email, password } = req.body;

        if (role === "Admin" || role === "Student") {
            let roleId;

            // Assign roleId based on different role
            switch (role) {
                case "Admin":
                    roleId = 1;
                    break;
                case "Student":
                    roleId = 2;
                    break;
                default:
                    roleId = 0;
            }

            const user = await User.create({ roleId, email, password });
            res.status(201).json({ user: { _id: user._id, roleId: user.roleId, email: user.email } });
        } else {
            res.status(400).json({ error: 'Please provide a correct user role' });
        }
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
});

// Get to login page
router.get("/login", (req, res) => res.json('Welcome to Login page'))

// Post to login and login user if authentication successfully
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);

        // Create and save token in cookie after successful login
        const token = createToken(user._id, user.roleId);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ user: { _id: user._id, roleId: user.roleId, email: user.email } });
    } catch (error) {
        if (error.message === 'Incorrect password') {
            statusCode = 400;
        } else if (error.message === 'Email not found') {
            statusCode = 404;
        }
        res.status(statusCode).json({ error: error.message });
    }
});

module.exports = router