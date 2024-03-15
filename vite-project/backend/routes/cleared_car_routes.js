const express = require('express')
// controller functions
const {
    getClearedCars,
    getOneClearedCar,
    addToClearedCars,
    updateClearedCar,
    deleteClearedCar
} = require('../controllers/cleared_car_controllers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Require Auth for all Cleared car routes
router.use(requireAuth)

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
