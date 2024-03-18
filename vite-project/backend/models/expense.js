const mongoose = require('mongoose')

const Schema = mongoose.Schema

const expense = new Schema({
    createdAt:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('expense', expense)