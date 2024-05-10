const mongoose = require('mongoose');
const { formatDate } = require('../controllers/functions/formatDate')

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    measurement_unit: {
        type: String,
    },
    unitPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: String,
        default: () => formatDate(new Date())
    },
})

module.exports = mongoose.model('Item', itemSchema)