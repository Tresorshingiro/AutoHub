const mongoose = require('mongoose')

const Schema = mongoose.Schema

const clearedCarSchema = new Schema({
    car_data: {
        type: Schema.Types.ObjectId,
        ref: 'vehicleModel',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    clearedAt: {
        type: Date,
        default: Date.now
    },
    worker_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model('ClearedCar', clearedCarSchema) // Collection name
