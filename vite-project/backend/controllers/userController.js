const User = require('../models/userModel')

// Login user
const loginUser = async (req, res) => {
    res.json({mssg: 'User login'})
} 

// Signup User
const signupUser = async (req, res) => {
    res.json({mssg: 'User signUp'})
}

module.exports = {
    loginUser,
    signupUser
}