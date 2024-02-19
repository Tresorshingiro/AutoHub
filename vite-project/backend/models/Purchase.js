const mongoose = require('mongoose');

const purchaseSchema =  mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  supplier: { type: String, required: true },
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
}
});



module.exports = mongoose.model('Purchase', purchaseSchema);
