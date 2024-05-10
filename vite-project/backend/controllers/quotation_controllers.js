const Quotation = require('../models/quotationModel')
const RepairService = require('../models/repairServiceModel')
const mongoose = require('mongoose')


const getQuotation = async (req, res) => {
    try {
        const quotations = await Quotation.find()
            .populate('car_id')
            .populate('worker_id')
            .populate('repair_service_id')
            .sort({ createdAt: -1 });

        res.status(200).json(quotations);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Getting all cleared cars
const getQuotations = async (req, res) => {
    const quotation = await Quotation.find({}).populate('car_id').populate('worker_id').populate('repair_service_id').sort({createdAt: -1})

    res.status(200).json(quotation)
}

// Getting a single cleared car
const getOneQuotation = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    const quotation = await Quotation.findById(id).populate('car_id').populate('worker_id').populate('repair_service_id')

    if(!quotation) {
        return res.status(404).json({error: 'No such Quotation'})
    }

    res.status(200).json(quotation)
}

// Adding a car to the cleared list
const createQuotation = async (req, res) => {
    const {car_id, total_price, vatIncluded, isApproved, createdAt, description, category, stock_item, quantity, unitPrice } = req.body

    try {
        const worker_id = req.user._id
        const repair_service = await RepairService.create({
            description,
            category,
            stock_item,
            quantity,
            unitPrice
        })
        const quotation = await Quotation.create({
            car_id,
            worker_id,
            repair_service_id: repair_service._id,
            total_price,
            vatIncluded,
            isApproved,
            createdAt
        })
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

    const quotation = await Quotation.findOneAndUpdate({_id: id}, {
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

    const quotation = await Quotation.findOneAndDelete({_id: id})

    if(!quotation) {
        return res.status(404).json({error: 'No such Quotation'})
    }
    res.status(200).json(quotation)
}

module.exports = {
    getQuotation,
    getQuotations,
    getOneQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation
}