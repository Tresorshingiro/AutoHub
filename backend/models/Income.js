const mongoose = require('mongoose')

const incomeSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
    required: true
  },
  customerName: {
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
  description: {
    type: String,
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
  notes: {
    type: String
  }
}, {
  timestamps: true
})

// Auto-generate reference number
incomeSchema.pre('save', async function(next) {
  if (!this.referenceNumber) {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, new Date().getMonth(), 1),
        $lt: new Date(year, new Date().getMonth() + 1, 1)
      }
    })
    this.referenceNumber = `INC-${year}${month}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

// Index for efficient queries (referenceNumber already indexed due to unique: true)
incomeSchema.index({ vehicleId: 1 })
incomeSchema.index({ date: -1 })
incomeSchema.index({ paymentMethod: 1 })

module.exports = mongoose.model('Income', incomeSchema)
