const mongoose = require('mongoose')

const quotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  parts: [{
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true
    },
    availability: {
      type: String,
      enum: ['in-stock', 'order-required', 'unavailable'],
      default: 'in-stock'
    }
  }],
  serviceCharge: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  summary: {
    partsTotal: {
      type: Number,
      required: true,
      default: 0
    },
    serviceCharge: {
      type: Number,
      required: true,
      default: 0
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    includeVAT: {
      type: Boolean,
      default: false
    },
    taxRate: {
      type: Number,
      default: 18 // 18% VAT in Rwanda
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
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

// Auto-generate quotation number
quotationSchema.pre('save', async function(next) {
  if (!this.quotationNumber) {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, new Date().getMonth(), 1),
        $lt: new Date(year, new Date().getMonth() + 1, 1)
      }
    })
    this.quotationNumber = `QT-${year}${month}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

// Calculate totals before saving
quotationSchema.pre('save', function(next) {
  // Calculate parts total
  this.summary.partsTotal = this.parts.reduce((sum, part) => sum + part.totalPrice, 0)
  
  // Calculate subtotal (parts + service charge - discount)
  this.summary.subtotal = this.summary.partsTotal + this.serviceCharge - this.summary.discountAmount
  
  // Calculate tax only if VAT is included
  if (this.summary.includeVAT) {
    this.summary.taxAmount = (this.summary.subtotal * this.summary.taxRate) / 100
  } else {
    this.summary.taxAmount = 0
  }
  
  // Calculate grand total
  this.summary.grandTotal = this.summary.subtotal + this.summary.taxAmount
  
  next()
})

// Index for efficient queries (quotationNumber already indexed due to unique: true)
quotationSchema.index({ vehicleId: 1 })
quotationSchema.index({ mechanicId: 1 })
quotationSchema.index({ status: 1 })
quotationSchema.index({ createdAt: -1 })

// Virtual for age in days
quotationSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24))
})

// Method to approve quotation
quotationSchema.methods.approve = function(notes) {
  this.status = 'approved'
  this.notes = notes || this.notes
  return this.save()
}

// Method to reject quotation
quotationSchema.methods.reject = function(notes) {
  this.status = 'rejected'
  this.notes = notes || this.notes
  return this.save()
}

module.exports = mongoose.model('Quotation', quotationSchema)
