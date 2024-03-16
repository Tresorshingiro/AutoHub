const mongoose = require('mongoose')

const Schema = mongoose.Schema

const income = new Schema({
    invoiceNumber:{
        type:Number,
        required:true
    },
    createdAt:{
        type:String,
    },
    customerName:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['unPaid','Partially Paid','Full Paid']
    },
    payment:{
        type:String,
        enum:['Cash','Bank','Mobile Money','Cheque']
    },
    amount:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('income', income)