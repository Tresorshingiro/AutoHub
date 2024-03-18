const Car_data = require('../models/Reception_car_model')
const mongoose = require('mongoose')

// Getting all car details
const getAllCars = async (req, res) => {
    const vehicleData = await Car_data.find({}).sort({createdAt: -1})

    res.status(200).json(vehicleData)
}

// Getting a single car
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
    const { owner, brand, type, plate, insurance, telephone, email, service } = req.body

    try {
        const worker_id = req.user._id
        const vehicle = await Car_data.create({owner, brand, type, plate, insurance, telephone, email, service, worker_id})
        res.status(200).json(vehicle)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
}

// Deleting a car
const deleteVehicle = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    const vehicle = await Car_data.findOneAndDelete({_id: id})

    if(!vehicle) {
        return res.status(404).json({error: 'No such Vehicle'})
    }
    res.status(200).json(vehicle)
}

// Update a car

const updateVehicle = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid Vehicle ID' });
    }

    try {
        console.log('Received PUT request for vehicle update:', req.body);

        const updatedVehicle = await Car_data.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );

        if (!updatedVehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        console.log('Vehicle updated successfully:', updatedVehicle);
        res.status(200).json(updatedVehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getAllCars,
    getOneCar,
    createVehicle,
    deleteVehicle,
    updateVehicle
}