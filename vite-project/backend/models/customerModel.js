const mongoose = require('mongoose');

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
        default: () => {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
            return currentDate.toISOString().slice(0, -5); // Remove milliseconds
        }
    }
});

module.exports = mongoose.model('Customer', clientSchema); // Collection name
