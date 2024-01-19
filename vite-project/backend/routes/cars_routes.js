const express = require('express')

const router = express.Router()

// GET all users
router.get('/', (req, res) => {
    res.json({mssg: "GET all cars"})
})

// GET a single user
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET a single car'})
})

// Post a new user
router.post('/', (req, res) => {
    res.json({mssg: 'POST a single car'})
})

// Delete a user
router.delete('/:id', (req, res) => {
    res.json({mssg: "DELETE a single car"})
})

// Create a user
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a single car'})
})

module.exports = router
