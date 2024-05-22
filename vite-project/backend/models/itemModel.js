const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    measurement_unit: {
        type: String,
        enum:['litre', 'kilogram', 'other'],
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Item', itemSchema)