const mongoose = require('mongoose')

const Schema = mongoose.Schema

const invoice = new Schema({
    owner:{
        type:String,
        required:true
    },
    invoiceNumber:{
        type:Number,
        required:true
    },
    createdAt:{
        type:String
    },
    status:{
       type:String,
       enum:['unPaid','Partially Paid','Full Paid'] 
    },
    payment:{
        type:String,
        enum:['Credit Card','Cash','Mobile Money','Bank','Cheque']
    },
    amount:{
        type:Number,
        required:true
    },
    amountPaid:{
        type:Number,
        required:true
    },
    vatIncluded:{
        type:Boolean,
        default:false
    },
    discount:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('invoice', invoice) 