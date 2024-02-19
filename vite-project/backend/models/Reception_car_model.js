const mongoose = require('mongoose')

const Schema = mongoose.Schema

const receptionCar = new Schema({
    owner: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    type: {
        type:String,
        required:true
    },
    plate: {        
        type: String,
        required: true
    },
    insurance: {
        type: String,
        required: true
    },
    telephone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: String,
        default: () => {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
            return currentDate.toISOString().slice(0, -5); // Remove milliseconds
        }
    },
    updatedAt: {
        type: String,
        default: () => {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
            return currentDate.toISOString().slice(0, -5); // Remove milliseconds
        }
    },
});

module.exports = mongoose.model('receptionCar', receptionCar) // Collection name
