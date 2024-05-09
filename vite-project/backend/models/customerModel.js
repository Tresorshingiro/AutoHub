const mongoose = require('mongoose');
const formatDate = require('../controllers/functions/formatDate')

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    names: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    address: {
        type: String
    },
    TIN_no: {
        type: String,
        unique: true
    },
    true_client: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: () => formatDate(new Date())
    }
});

module.exports = mongoose.model('Customer', clientSchema); // Collection name
