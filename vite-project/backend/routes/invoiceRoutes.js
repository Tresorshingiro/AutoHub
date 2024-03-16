const express = require('express')
const {
    getAllInvoice,
    getOneInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice } = require('../controllers/invoice_controllers')

const router = express.Router()

router.get('/', getAllInvoice)

router.get('/:id', getOneInvoice)

router.post('/', createInvoice)

router.patch('/:id', updateInvoice)

router.delete('/:id', deleteInvoice)

module.exports = router