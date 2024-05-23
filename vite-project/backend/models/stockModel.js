const mongoose = require('mongoose');

const Schema = mongoose.Schema

const stockSchema =  new Schema({
    item_id: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    volume_remaining: {
        type: Number,
        required: true
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Stock', stockSchema);
