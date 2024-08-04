const mongoose = require('mongoose');

const Schema = mongoose.Schema

const purchaseSchema =  new Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
