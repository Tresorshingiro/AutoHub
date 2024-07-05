const express = require('express')
// controller functions
const { loginUser, signupUser, getAllUsers, updateUser } = require('../controllers/userController')

const router = express.Router()

// shrotcut to see all users
router.get('/', getAllUsers)

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)
// update route
router.patch('/updateUser/:id', updateUser)

module.exports = router