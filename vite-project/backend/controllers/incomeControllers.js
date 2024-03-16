const income = require('../models/income')
const mongoose = require('mongoose')

const getAllIncome = async(req,res) => {
    const incomeData = await income.find().sort({createdAt: -1})

    res.status(200).json(incomeData)
}

const getOneIncome = async(req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json('No Such Income')
    }

    const incomeData = await income.findById(id)
    if(!incomeData){
        res.status(404).json('No Such Income')
    }
    res.status(200).json(incomeData)
}

const createIncome = async(req,res) => {
    const {invoiceNumber, createdAt, customerName, status, payment, amount} = req.body
    try{
       const incomeData = await income.create({invoiceNumber, createdAt, customerName, status, payment,amount})
       res.status(200).json(incomeData) 
    }catch(error){
        console.log('Error:', error)
        res.status(400).json({error: error.message})
    }
}

const updateIncome = async(req,res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json('No such Income')
    }
    const incomeData = await income.findOneAndUpdate({_id: id},{
        ...req.body
    })
    if(!incomeData){
        res.status(404).json('No such Income')
    }
    res.status(200).json(incomeData)
}

const deleteIncome = async(req,res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json('No such Income')
    }

    const incomeData = await income.findOneAndDelete({_id: id})
    if(!incomeData){
        res.status(404).json('No such Income')
    }
    res.status(200).json(incomeData)
}

module.exports = {
    getAllIncome,
    getOneIncome,
    createIncome,
    updateIncome,
    deleteIncome
}