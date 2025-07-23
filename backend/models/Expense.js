const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: [
      'parts-purchase',
      'supplier-payment',
      'utilities',
      'electricity',
      'water',
      'internet',
      'salaries',
      'rent',
      'equipment',
      'maintenance',
      'marketing',
      'insurance',
      'fuel',
      'office-supplies',
      'other'
    ],
    required: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
    // Not required - some expenses like utilities don't need a supplier
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank-transfer', 'mobile-money', 'credit-card', 'cheque'],
    required: true
  },
  accountantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  receipt: {
    url: { type: String },
    publicId: { type: String }
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid'],
    default: 'paid'
  }
}, {
  timestamps: true
})

// Auto-generate reference number
expenseSchema.pre('save', async function(next) {
  if (!this.referenceNumber) {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, new Date().getMonth(), 1),
        $lt: new Date(year, new Date().getMonth() + 1, 1)
      }
    })
    this.referenceNumber = `EXP-${year}${month}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

// Index for efficient queries (referenceNumber already indexed due to unique: true)
expenseSchema.index({ category: 1 })
expenseSchema.index({ supplierId: 1 })
expenseSchema.index({ date: -1 })
expenseSchema.index({ status: 1 })

module.exports = mongoose.model('Expense', expenseSchema)
