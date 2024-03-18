const express = require('express')
const {
    getAllExpense,
    getOneExpense,
    createExpense,
    updateExpense,
    deleteExpense} = require ('../controllers/expenseControllers')

const router = express.Router()

router.get('/', getAllExpense)

router.get('/:id', getOneExpense)

router.post('/', createExpense)

router.patch('/:id', updateExpense)

router.delete('/:id', deleteExpense)

module.exports = router