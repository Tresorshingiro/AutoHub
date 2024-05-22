// const invoice = require('../models/invoice')
// const mongoose = require('mongoose')

// const getAllInvoice = async(req,res) => {
//     const invoiceData = await invoice.find().sort({createdAt: -1})

//     res.status(200).json(invoiceData)
// }

// const getOneInvoice = async(req,res) => {
//     const { id } = req.params
//     if(!mongoose.Types.ObjectId.isValid(id)){
//        return  res.status(404).json({error: 'No such Invoice'})
//     }

//     const invoiceData = await invoice.findById(id)
//     if(!invoiceData){
//         res.status(404).json({error: 'No Such Invoice'})
//     }
//     res.status(200).json(invoiceData)
// }

// const createInvoice = async(req,res) => {
//     const {owner, invoiceNumber, createdAt, status, payment, amount, amountPaid, vatIncluded, discount} = req.body
//     try{
//        const invoiceData = await invoice.create({owner, invoiceNumber, createdAt, status, payment, amount, amountPaid, vatIncluded, discount})
//        res.status(200).json(invoiceData)
//     }catch(error){
//         console.log('Error:' , error);
//         res.status(400).json({error: error.message})
//     }
// }

// const updateInvoice = async(req,res) => {
//     const { id } = req.params
//     if(!mongoose.Types.ObjectId.isValid(id)){
//         return res.status(404).json('No Such Invoice')
//     }
//     const invoiceData = await invoice.findOneAndUpdate({_id: id}, {
//         ...req.body
//     })
//     if(!invoiceData){
//         res.status(404).json('No Such Invoice')
//     }
//     res.status(200).json(invoiceData)
// }

// const deleteInvoice = async(req,res) => {
//     const { id } = req.params
//     if(!mongoose.Types.ObjectId.isValid(id)){
//         return res.status(404).json('No Such Invoice')
//     }
//     const invoiceData = await invoice.findOneAndDelete({_id: id})
//     if(!invoiceData){
//         res.status(404).json('No Such Invoice')
//     }
//     res.status(200).json(invoiceData)
// }

// module.exports = {
//     getAllInvoice,
//     getOneInvoice,
//     createInvoice,
//     updateInvoice,
//     deleteInvoice
// }