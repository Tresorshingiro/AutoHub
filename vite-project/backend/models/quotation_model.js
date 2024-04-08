const mongoose = require('mongoose')

const Schema = mongoose.Schema

const QuotationSchema = new Schema({
    owner: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    plate: {        
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    furniture: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    vatIncluded: {
        type: Boolean,
        default: false
    },
    total_price: {
        type: Number,
        required: true,
      },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    },
    worker_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Quotations', QuotationSchema) // Collection name
