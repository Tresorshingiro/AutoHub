const mongoose = require('mongoose')
const { formatDate } = require('../controllers/functions/formatDate')

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
        type: String,
        default: () => {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
            return currentDate.toISOString().slice(0, -5); // Remove milliseconds
        }
    },
    worker_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model('ClearedCar', clearedCarSchema) // Collection name
