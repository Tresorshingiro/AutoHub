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
    unitPrice: {
        type: Number,
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



module.exports = mongoose.model('Stock', stockSchema);
