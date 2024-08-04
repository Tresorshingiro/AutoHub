const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const supplierSchema =  new Schema({
    company_name: {
        type: String,
        required: true,
        unique: true
    },
    TIN_no: { 
        type: Number, 
        required: true,
        unique: true
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
    }
}, { timestamps: true });



module.exports = mongoose.model('Supplier', supplierSchema);
