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
    total_price: {
        type: Number,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: () => {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
            return currentDate.toISOString().slice(0, -5); // Remove milliseconds
        }
    }
});

module.exports = mongoose.model('Quotation', QuotationSchema) // Collection name
