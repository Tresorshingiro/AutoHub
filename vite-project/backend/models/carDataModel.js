const mongoose = require('mongoose')

const Schema = mongoose.Schema

const carData = new Schema({
    owner: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    plate: {        
        type: String,
        required: true
    }
});

module.exports = mongoose.model('carData', carData) // Collection name
