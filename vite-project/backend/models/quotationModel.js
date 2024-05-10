const mongoose = require('mongoose')
const formatDate = require('../controllers/functions/formatDate')

const Schema = mongoose.Schema

const QuotationSchema = new Schema({
    car_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    worker_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    repair_service_id: {
        type: Schema.Types.ObjectId,
        ref: 'repairService',
        required: true
    },
    VAT_included: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: () => formatDate(new Date())
    }
});

module.exports = mongoose.model('Quotation', QuotationSchema) // Collection name
