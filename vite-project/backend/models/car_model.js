const mongoose = require('mongoose')

const Schema = mongoose.Schema

const car_data = new Schema({
    title: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    model_year: {
        type: Number,
        required: true
    },
    plate_no: {        
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }
}, {timestamps: true})

module.exports = mongoose.model('car_data', car_data)
