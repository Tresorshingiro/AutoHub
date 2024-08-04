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
    }
});


module.exports = mongoose.model('Stock', stockSchema);
