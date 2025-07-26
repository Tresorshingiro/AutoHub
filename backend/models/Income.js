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
    required: false // Made optional for manual income entries
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false // Made optional for manual income entries
  },
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
    required: false // Made optional for manual income entries
  },
  customerName: {
    type: String,
    required: false // Made optional for manual income entries
  },
  vehicleRef: {
    type: String, // For manual entries, store plate number as string
    required: false
  },
  category: {
    type: String,
    enum: ['service_payment', 'parts_sales', 'consultation', 'insurance_claim', 'other'],
    default: 'other',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'credit_card', 'cheque'],
    required: true
  },
  phoneNumber: {
    type: String,
    // Required only for mobile money payments
    validate: {
      validator: function(v) {
        // If paymentMethod is mobile_money, phoneNumber is required
        if (this.paymentMethod === 'mobile_money') {
          return v && v.length > 0
        }
        return true
      },
      message: 'Phone number is required for mobile money payments'
    }
  },
  accountNumber: {
    type: String,
    // Required for bank transfer and credit card payments
    validate: {
      validator: function(v) {
        // If paymentMethod is bank_transfer or credit_card, accountNumber is required
        if (['bank_transfer', 'credit_card'].includes(this.paymentMethod)) {
          return v && v.length > 0
        }
        return true
      },
      message: 'Account number is required for bank transfer and credit card payments'
    }
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
