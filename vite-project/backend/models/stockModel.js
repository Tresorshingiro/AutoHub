const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  item_id: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  volume_remaining: {
    type: Number,
    required: true
  },
  total_value: {
    type: Number,
    default: 0  // Default value is 0; it will be updated automatically
  }
}, {
  timestamps: true // This will add `createdAt` and `updatedAt` fields
});

// Pre-save middleware to update total_value
stockSchema.pre('save', async function (next) {
  if (this.isModified('volume_remaining') || this.isNew) {
    try {
      const item = await mongoose.model('Item').findById(this.item_id).exec();
      if (item) {
        this.total_value = item.unitPrice * this.volume_remaining;
      } else {
        this.total_value = 0;  // Fallback if item is not found
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Stock', stockSchema);
