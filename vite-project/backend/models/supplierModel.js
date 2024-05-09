const mongoose = require('mongoose');
const formatDate = require('../controllers/functions/formatDate')

const Schema = mongoose.Schema;

const supplierSchema =  new Schema({
    company_name: {
        type: String,
        required: true
    },
    TIN_no: { 
        type: Number, 
        required: true 
    },
    telephone: { 
        type: Number, 
        required: true 
    },
    email: {
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    createdAt: {
        type: String,
        default: () => formatDate(new Date())
    }
});



module.exports = mongoose.model('Supplier', supplierSchema);
