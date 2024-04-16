const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const supplierTransactionSchema = new Schema({
    item_id: {
        type: String,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    transactedAt: {
        type: String,
        default: () => {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
            return currentDate.toISOString().slice(0, -5); // Remove milliseconds
        }
    }
})

module.exports = mongoose.model('SupplierTransaction', supplierTransactionSchema)