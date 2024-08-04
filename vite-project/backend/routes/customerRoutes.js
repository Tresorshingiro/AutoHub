const express = require('express')
// controller functions
const {
    getAllCustomers,
    getOneCustomer,
    createCustomer,
    deleteCustomer, 
    deleteAllCustomers,
    updateCustomer
} = require('../controllers/customerController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Require Auth for all Reception car routes
router.use(requireAuth)

// GET all cars
router.get('/', getAllCustomers)

// GET a single car
router.get('/:id', getOneCustomer)

// Post a new car
router.post('/', createCustomer)

// Delete a car
router.delete('/:id', deleteCustomer)

// Delete a car
router.delete('/', deleteAllCustomers)

// Update a car
router.patch('/:id', updateCustomer)

module.exports = router
