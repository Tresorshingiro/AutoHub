const mongoose = require('mongoose')
const { formatDate } = require('../controllers/functions/formatDate')

const Schema = mongoose.Schema

const inserviceCarSchema = new Schema({
    car_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    Status: {
        type: String,
        // Still needs some updates
        enum: ['Inservice', 'Quoted', 'QuotedButNotPaid', 'Cleared'],
        required: true
    },
    quotation_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quotation'
    },
    registeredAt: {
        type: String,
        default: () => formatDate(new Date())
    }
})

module.exports = mongoose.model('InserviceCar', inserviceCarSchema)