const Car_data = require('../models/vehicleModel')
const Customer = require('../models/customerModel')
const mongoose = require('mongoose')

// Getting all car details
const getAllCars = async (req, res) => {
  try{
    const vehicleData = await Car_data.find({}).populate('owner').sort({createdAt: -1})

    const distinctOwners = new Set(vehicleData.map(vehicle => String(vehicle.owner._id)));
    const customerCount = distinctOwners.size;

    res.status(200).json({vehicleData, customerCount})
  } catch(error){
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Getting a single car
const getOneCar = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    const vehicle = await Car_data.findById(id).populate('owner')

    if(!vehicle) {
        return res.status(404).json({error: 'No such Vehicle'})
    }

    res.status(200).json(vehicle)
}

// Creating a car details
const createVehicle = async (req, res) => {
    const { names, telephone, email, address, TIN_no, true_client, brand, type, plate_no, insurance, engine, chassis_no, service } = req.body

    try {
        const customer = await Customer.create({names, telephone, email, address, TIN_no, true_client})
        const vehicle = await Car_data.create({
            owner: customer._id, 
            brand, 
            type, 
            plate_no, 
            insurance,
            engine,
            chassis_no,
            service
        })
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