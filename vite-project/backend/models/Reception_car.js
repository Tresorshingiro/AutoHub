const mongoose = require('mongoose')

const Schema = mongoose.Schema

const receptionCar = new Schema({
    owner: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    plate: {        
        type: String,
        required: true
    },
    insurance: {
        type: String,
        required: true
    },
    telephone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }
}, {timestamps: true})

module.exports = mongoose.model('receptionCar', receptionCar) // Collection name
