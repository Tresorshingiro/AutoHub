const mongoose = require('mongoose');

const Schema = mongoose.Schema

const purchaseSchema =  new Schema({
    quotation_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quotation',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    payment_no: {
        type: String,
        required: true
    },
    amount_paid: {
        type: Number,
        required: true
    },
    amount_remaining: {
        type: Number,
        required: true,
    },
    payment_type: {
        type: String,
        required: true
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

module.exports = mongoose.model('Purchase', purchaseSchema);
