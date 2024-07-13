const express = require('express')
// controller functions
const {
    getQuotation,
    getQuotations,
    getOneQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation
} = require('../controllers/quotation_controllers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Require Auth for all quotation routes
router.use(requireAuth)

router.get('/', getQuotation)

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
