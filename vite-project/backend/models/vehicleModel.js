const mongoose = require('mongoose')

const Schema = mongoose.Schema

const vehicleSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    plate_no: {        
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    insurance: {
        type: String,
        required: true
    },
    engine: {
        type: String
    },
    chassis_no: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema) // Collection name
