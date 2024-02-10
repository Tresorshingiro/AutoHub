const express = require('express')
const {
    getAllCars,
    getOneCar,
    createVehicle, 
    deleteVehicle, 
    updateVehicle
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
router.patch('/:id', updateVehicle)

module.exports = router
