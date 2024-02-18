const express = require('express')
const {
    getClearedCars,
    getOneClearedCar,
    addToClearedCars,
    updateClearedCar
} = require('../controllers/cleared_car_controllers')

const router = express.Router()

// GET all cars
router.get('/', getClearedCars)

// GET a single car
router.get('/:id', getOneClearedCar)

// put a vehicle to the cleared vehicles
router.post('/', addToClearedCars)

// Update a car
router.patch('/:id', updateClearedCar)

module.exports = router
