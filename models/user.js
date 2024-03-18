/*
Name: Wenjie Zhou
Student ID: 301337168
Date: 2024-03-18
*/

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')


// User properties
const userSchema = new mongoose.Schema({
    roleId: {
        type: Number,
        required: [true, 'Please provide a role']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validator: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Min length of password is 6']
    }
})

// salting and hashing the password
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Handle login
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const isAuth = await bcrypt.compare(password, user.password);
        if (isAuth) {
            return user;
        }
        throw new Error('Incorrect password');
    }
    else {
        throw new Error('Email not found');
    }
}

const User = mongoose.model('user', userSchema);

module.exports = User;