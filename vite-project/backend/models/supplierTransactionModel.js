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
    }
}, { timestamps: true });

module.exports = mongoose.model('SupplierTransaction', supplierTransactionSchema)