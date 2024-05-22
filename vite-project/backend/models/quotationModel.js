const mongoose = require('mongoose')

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
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quotation', QuotationSchema) // Collection name
