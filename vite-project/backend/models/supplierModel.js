const mongoose = require('mongoose');


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
        default: () => {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
            return currentDate.toISOString().slice(0, -5); // Remove milliseconds
        }
    }
});



module.exports = mongoose.model('Supplier', supplierSchema);
