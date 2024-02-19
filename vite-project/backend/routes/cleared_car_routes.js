const express = require('express')
const {
    getClearedCars,
    getOneClearedCar,
    addToClearedCars,
    updateClearedCar,
    deleteClearedCar
} = require('../controllers/cleared_car_controllers')

const router = express.Router()

// GET all cars
router.get('/', getClearedCars)

// GET a single car
router.get('/:id', getOneClearedCar)

// put a vehicle to the cleared vehicles
router.post('/', addToClearedCars)

// Update a cleared car
router.patch('/:id', updateClearedCar)

// Delete cleared car
router.delete('/:id', deleteClearedCar)

module.exports = router
