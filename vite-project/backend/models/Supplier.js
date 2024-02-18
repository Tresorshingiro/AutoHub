const mongoose = require('mongoose');

const supplierSchema =  mongoose.Schema({
  name: { type: String, required: true },
  tin: { type: Number, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
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



module.exports = mongoose.model('Supplier', supplierSchema);
