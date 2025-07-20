const mongoose = require('mongoose')

const VehicleSchema = new mongoose.Schema({
    vehicleBrand: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    ModelYear: {
        type: String,
        required: true
    },
    PlateNo: {
        type: String,
        required: true
    },
    ChassisNo: {
        type: String,
        required: true
    },
    engine: {
        type: String,
        required: true
    },
    customer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    insurance: {
        type: String,
        required: true
    },
    TinNo: {
        type: String,
        required: true
    },
    concerns: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ['awaiting-diagnosis', 'in-progress', 'waiting-parts', 'completed'],
        default: 'awaiting-diagnosis'
    }
}, {timestamps: true})

const Vehicle = mongoose.model('Vehicle', VehicleSchema)

module.exports = Vehicle