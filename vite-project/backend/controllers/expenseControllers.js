// // const expense = require('../models/expense')
// const mongoose = require('mongoose')

// const getAllExpense = async(req,res) => {
//     const expenseData = await expense.find()
//     res.status(200).json(expenseData)
// }

// const getOneExpense = async(req,res) => {
//     const { id } = req.params
//     if(!mongoose.Types.ObjectId.isValid(id)){
//         return res.status(404).json('No Such Expense')
//     }
//     const expenseData = await expense.findById(id)
//     if(!incomeData){
//         res.status(404).json('No Such Expense')
//     }
//     res.status(200).json(expenseData)
// }

// const createExpense = async(req,res) =>{
//     const {createdAt, description, category, amount} = req.body
//     try{
//     const expenseData = await expense.create({createdAt, description, category, amount})
//     res.status(200).json(expenseData)
//     }catch(error){
//         console.log('Error', error)
//         res.status(400).json({error: error.message})
//     }
// }

// const updateExpense = async(req,res) => {
//     const { id } = req.params
//     if(!mongoose.Types.ObjectId.isValid(id)){
//         return res.status(404).json('No Such Expense')
//     }
//     const expenseData = await expense.findOneAndUpdate({_id: id},{
//         ...req.body
//     })
//     if(!expenseData){
//         res.status(404).json('No Such Expense')
//     }
//     res.status(200).json(expenseData)
// }

// const deleteExpense = async(req,res) => {
//     const { id } = req.params
//     if(!mongoose.Types.ObjectId.isValid(id)){
//         return res.status(404).json('No Such Expense')
//     }
//     const expenseData = await expense.findOneAndDelete({_id:id})
//     if(!expenseData){
//         res.status(404).json('No Such Expense')
//     }
//     res.status(200).json(expenseData)
// }

// module.exports = {
//     getAllExpense,
//     getOneExpense,
//     createExpense,
//     updateExpense,
//     deleteExpense
// }