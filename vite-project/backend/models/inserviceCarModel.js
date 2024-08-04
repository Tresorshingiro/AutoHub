const mongoose = require('mongoose')

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
    }
}, { timestamps: true });

module.exports = mongoose.model('InserviceCar', inserviceCarSchema)