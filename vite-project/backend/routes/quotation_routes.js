const express = require('express')
const {
    getQuotations,
    getOneQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation
} = require('../controllers/quotation_controllers')

const router = express.Router()

// GET all cars quotations
router.get('/', getQuotations)

// GET a single car's quotation
router.get('/:id', getOneQuotation)

// Create quotation
router.post('/', createQuotation)

// Update a cleared car
router.patch('/:id', updateQuotation)

// Delete quotation
router.delete('/:id', deleteQuotation)

module.exports = router
