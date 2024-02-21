const express = require('express')
// controller functions
const {
    getAllCars,
    getOneCar,
    createVehicle, 
    deleteVehicle, 
    updateVehicle
} = require('../controllers/cars_controllers')

const router = express.Router()

// GET all cars
router.get('/', getAllCars)

// GET a single car
router.get('/:id', getOneCar)

// Post a new car
router.post('/', createVehicle)

// Delete a car
router.delete('/:id', deleteVehicle)

// Update a car
router.patch('/:id', updateVehicle)

module.exports = router
