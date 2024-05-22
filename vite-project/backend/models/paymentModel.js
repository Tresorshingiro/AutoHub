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
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
