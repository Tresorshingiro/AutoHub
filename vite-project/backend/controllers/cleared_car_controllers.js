const Cleared_cars = require('../models/clearedCarModel')
const mongoose = require('mongoose')

// Getting all cleared cars
const getClearedCars = async (req, res) => {
    const vehicle = await Cleared_cars.find({}).sort({createdAt: -1})

    res.status(200).json(vehicle)
}

// Getting a single cleared car
const getOneClearedCar = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    const vehicle = await Cleared_cars.findById(id)

    if(!vehicle) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    res.status(200).json(vehicle)
}

// Adding a car to the cleared list
const addToClearedCars = async (req, res) => {
    const { owner, brand, plate, type, insurance, telephone, email, description, furniture, quantity, unitPrice, vatIncluded, total_price, createdAt } = req.body

    try {
        const worker_id = req.user._id
        const vehicle = await Cleared_cars.create({ worker_id, owner, brand, plate, type, insurance, telephone, email, description,furniture,quantity, unitPrice, vatIncluded, total_price, createdAt})
        res.status(200).json(vehicle)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
}

// Update a cleared car

const updateClearedCar = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    const vehicle = await Cleared_cars.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!vehicle) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    res.status(200).json(vehicle)
}

// Deleting a cleared car
const deleteClearedCar = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    const vehicle = await Cleared_cars.findOneAndDelete({_id: id})

    if(!vehicle) {
        return res.status(404).json({error: 'No such Vehicle'})
    }
    res.status(200).json(vehicle)
}

module.exports = {
    getClearedCars,
    getOneClearedCar,
    addToClearedCars,
    updateClearedCar,
    deleteClearedCar
}