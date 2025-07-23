const mongoose = require('mongoose')

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: { type: String },
    city: { type: String },
    country: { type: String, default: 'Rwanda' },
    postalCode: { type: String }
  },
  taxNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountName: { type: String }
  },
  paymentTerms: {
    type: String,
    enum: ['Cash', 'Net 15', 'Net 30', 'Net 45', 'Net 60'],
    default: 'Net 30'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for search functionality
supplierSchema.index({ name: 'text', contactPerson: 'text' })

module.exports = mongoose.model('Supplier', supplierSchema)
