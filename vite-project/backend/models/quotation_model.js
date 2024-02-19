const mongoose = require('mongoose')

const Schema = mongoose.Schema

const quotedCar = new Schema({
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
    furniture: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    vatIncluded: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

module.exports = mongoose.model('quotedCar', quotedCar) // Collection name
