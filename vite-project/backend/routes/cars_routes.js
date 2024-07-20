const express = require('express')
// controller functions
const {
    getAllCars,
    getOneCar,
    createVehicle, 
    deleteVehicle, 
    updateVehicle,
    deleteAllVehicles
} = require('../controllers/cars_controllers')
const requireAuth = require('../middleware/requireAuth')
const { deleteAllCustomers } = require('../controllers/customerController')

const router = express.Router()

// Require Auth for all Reception car routes
router.use(requireAuth)

// GET all cars
router.get('/', getAllCars)

// GET a single car
router.get('/:id', getOneCar)

// Post a new car
router.post('/', createVehicle)

// Delete a car
router.delete('/:id', deleteVehicle)

// Delete all cars
router.delete('/', deleteAllVehicles)

// Update a car
router.patch('/:id', updateVehicle)

module.exports = router
