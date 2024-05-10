const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    item_name: {
        type: String,
        required: true
    },
    measurement_unit: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: String,
        default: () => {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
            return currentDate.toISOString().slice(0, -5); // Remove milliseconds
        }
    },
})

module.exports = mongoose.model('Item', itemSchema)