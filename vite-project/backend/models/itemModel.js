const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    measurement_unit: {
        type: String,
        enum:['litre', 'kilogram', 'other'],
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    supplier: [{
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema)