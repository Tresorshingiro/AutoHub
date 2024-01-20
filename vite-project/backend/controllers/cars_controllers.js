const Car_data = require('../models/Reception_car')
const mongoose = require('mongoose')

// Getting all car details
const getAllCars = async (req, res) => {
    const vehicleData = await Car_data.find({}).sort({createdAt: -1})

    res.status(200).json(vehicleData)
}

// Getting a single user
const getOneCar = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    const vehicle = await Car_data.findById(id)

    if(!vehicle) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    res.status(200).json(vehicle)
}

// Creating a car details
const createVehicle = async (req, res) => {
    const { owner, brand, plate, insurance, telephone, email, description } = req.body

    try {
        const vehicle = await Car_data.create({owner, brand, plate, insurance, telephone, email, description})
        res.status(200).json(vehicle)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
}

// Deleting a car details
const deleteVehicle = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

}

module.exports = {
    getAllCars,
    getOneCar,
    createVehicle,
    deleteVehicle
}