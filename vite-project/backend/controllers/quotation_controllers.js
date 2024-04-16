const quotedCar = require('../models/quotationModel')
const mongoose = require('mongoose')

// Getting all cleared cars
const getQuotations = async (req, res) => {
    const quotation = await quotedCar.find({}).sort({createdAt: -1})

    res.status(200).json(quotedCar)
}

// Getting a single cleared car
const getOneQuotation = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    const quotation = await quotedCar.findById(id)

    if(!quotation) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    res.status(200).json(quotation)
}

// Adding a car to the cleared list
const createQuotation = async (req, res) => {
    const {owner, brand, plate, type, furniture, service, description, quantity, unitPrice, vatIncluded, createdAt } = req.body

    try {
        const total_price = req.body.total_price;
        const worker_id = req.user._id
        const quotation = await Quotations.create({worker_id, owner, brand, plate, type, furniture, service, description, quantity, unitPrice, vatIncluded, total_price, createdAt})
        res.status(200).json(quotation)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
}

// Update a cleared car

const updateQuotation = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    const quotation = await quotedCar.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!quotation) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    res.status(200).json(quotation)
}

// Deleting a cleared car
const deleteQuotation = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    const quotation = await quotedCar.findOneAndDelete({_id: id})

    if(!quotation) {
        return res.status(404).json({error: 'No such Quotation'})
    }
    res.status(200).json(quotation)
}

module.exports = {
    getQuotations,
    getOneQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation
}