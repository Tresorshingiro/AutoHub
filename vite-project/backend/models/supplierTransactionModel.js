const mongoose = require('mongoose');
const formatDate = require('../controllers/functions/formatDate')

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
        default: () => formatDate(new Date())
    }
})

module.exports = mongoose.model('SupplierTransaction', supplierTransactionSchema)