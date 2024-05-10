const mongoose = require('mongoose');
const formatDate = require('../controllers/functions/formatDate')

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
    },
    createdAt: {
        type: String,
        default: () => formatDate(new Date())
    }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
