const express = require('express')
const {
    getAllCars,
    getOneCar,
    createVehicle, 
    deleteVehicle 
} = require('../controllers/cars_controllers')

const router = express.Router()

// GET all users
router.get('/', getAllCars)

// GET a single user
router.get('/:id', getOneCar)

// Post a new user
router.post('/', createVehicle)

// Delete a user
router.delete('/:id', deleteVehicle)

// Create a user
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a single car'})
})

module.exports = router
