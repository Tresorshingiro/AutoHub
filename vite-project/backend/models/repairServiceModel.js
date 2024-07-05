const mongoose = require('mongoose')

const Schema = mongoose.Schema

const repairServiceSchema = new Schema({
    description: {
        type: String,
    },
    category: {
        type: String
    },
    stock_item: {
        type: Schema.Types.ObjectId,
        ref: 'Stock',
        required:true
    },
    quantity: {
        type: Number,
        required:true
    },
    unitPrice: {
        type: Number,
        required:true
    },
    //worker_id: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'User',
      //   required: true
     //}
})

module.exports = mongoose.model('RepairService', repairServiceSchema)