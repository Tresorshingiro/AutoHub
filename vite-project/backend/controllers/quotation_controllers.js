const Quotations = require('../models/quotation_model')
const mongoose = require('mongoose')

// Getting all cleared cars
const getQuotations = async (req, res) => {
    const quotation = await Quotations.find({}).sort({createdAt: -1})

    res.status(200).json(quotation)
}

// Getting a single cleared car
const getOneQuotation = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    const quotation = await Quotations.findById(id)

    if(!quotation) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    res.status(200).json(quotation)
}

// Adding a car to the cleared list
const createQuotation = async (req, res) => {
    const {owner, brand, plate, furniture, quantity, unitPrice, vatIncluded, createdAt } = req.body

    try {
        const quotation = await Quotations.create({owner, brand, plate, furniture, quantity, unitPrice, vatIncluded, createdAt})
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

    const quotation = await Quotations.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!quotation) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    res.status(200).json(vehicle)
}

// Deleting a cleared car
const deleteQuotation = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    const quotation = await Quotations.findOneAndDelete({_id: id})

    if(!quotation) {
        return res.status(404).json({error: 'No such Quotation'})
    }
    res.status(200).json(vehicle)
}

module.exports = {
    getQuotations,
    getOneQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation
}