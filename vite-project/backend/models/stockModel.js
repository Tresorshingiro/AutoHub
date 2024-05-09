const mongoose = require('mongoose');
const { formatDate } = require('../controllers/functions/formatDate')

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
    createdAt: {
        type: String,
        default: () => formatDate(new Date())
    }
});



module.exports = mongoose.model('Stock', stockSchema);
