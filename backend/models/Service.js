const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  serviceNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
    required: true
  },
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  serviceItems: [{
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part'
    },
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    notes: {
      type: String
    }
  }],
  overallStatus: {
    type: String,
    enum: ['started', 'in-progress', 'completed', 'on-hold'],
    default: 'started'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
  },
  actualCost: {
    type: Number,
    min: 0
  },
  partsUsed: [{
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      required: true
    },
    quantityUsed: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalCost: {
      type: Number,
      required: true
    }
  }],
  serviceNotes: {
    type: String
  },
  mechanicNotes: [{
    note: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
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

// Auto-generate service number
serviceSchema.pre('save', async function(next) {
  if (!this.serviceNumber) {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, new Date().getMonth(), 1),
        $lt: new Date(year, new Date().getMonth() + 1, 1)
      }
    })
    this.serviceNumber = `SV-${year}${month}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

// Calculate progress based on completed service items
serviceSchema.pre('save', function(next) {
  if (this.serviceItems.length > 0) {
    const completedItems = this.serviceItems.filter(item => item.status === 'completed').length
    this.progress = Math.round((completedItems / this.serviceItems.length) * 100)
    
    // Update overall status based on progress
    if (this.progress === 0) {
      this.overallStatus = 'started'
    } else if (this.progress > 0 && this.progress < 100) {
      this.overallStatus = 'in-progress'
    } else if (this.progress === 100) {
      this.overallStatus = 'completed'
      if (!this.completedDate) {
        this.completedDate = new Date()
      }
    }
  }
  next()
})

// Calculate actual cost from parts used
serviceSchema.pre('save', function(next) {
  if (this.partsUsed.length > 0) {
    this.actualCost = this.partsUsed.reduce((total, part) => total + part.totalCost, 0)
  }
  next()
})

// Index for efficient queries (serviceNumber already indexed due to unique: true)
serviceSchema.index({ vehicleId: 1 })
serviceSchema.index({ quotationId: 1 })
serviceSchema.index({ mechanicId: 1 })
serviceSchema.index({ overallStatus: 1 })
serviceSchema.index({ createdAt: -1 })

// Virtual for service duration
serviceSchema.virtual('serviceDuration').get(function() {
  const endDate = this.completedDate || new Date()
  return Math.ceil((endDate - this.startDate) / (1000 * 60 * 60 * 24)) // days
})

// Method to add mechanic note
serviceSchema.methods.addMechanicNote = function(note) {
  this.mechanicNotes.push({ note })
  return this.save()
}

// Method to update service item status
serviceSchema.methods.updateServiceItem = function(itemId, status, notes) {
  const item = this.serviceItems.id(itemId)
  if (item) {
    item.status = status
    if (notes) item.notes = notes
    
    if (status === 'in-progress' && !item.startedAt) {
      item.startedAt = new Date()
    } else if (status === 'completed' && !item.completedAt) {
      item.completedAt = new Date()
    }
  }
  return this.save()
}

// Method to mark service as completed
serviceSchema.methods.completeService = function(notes) {
  this.overallStatus = 'completed'
  this.progress = 100
  this.completedDate = new Date()
  if (notes) {
    this.serviceNotes = notes
  }
  
  // Mark all service items as completed
  this.serviceItems.forEach(item => {
    if (item.status !== 'completed') {
      item.status = 'completed'
      item.completedAt = new Date()
    }
  })
  
  return this.save()
}

// Static method to find active services
serviceSchema.statics.findActiveServices = function(mechanicId) {
  const query = {
    overallStatus: { $in: ['started', 'in-progress'] }
  }
  
  if (mechanicId) {
    query.mechanicId = mechanicId
  }
  
  return this.find(query)
    .populate([
      { path: 'vehicleId', populate: { path: 'customer' } },
      { path: 'quotationId' },
      { path: 'mechanicId', select: 'name' },
      { path: 'serviceItems.partId', select: 'name partNumber' },
      { path: 'partsUsed.partId', select: 'name partNumber' }
    ])
    .sort({ createdAt: -1 })
}

module.exports = mongoose.model('Service', serviceSchema)
