const mongoose = require('mongoose')

const partSchema = new mongoose.Schema({
  partNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Engine Parts',
      'Transmission',
      'Brake System',
      'Suspension',
      'Electrical',
      'Body Parts',
      'Interior',
      'Exhaust',
      'Cooling System',
      'Fuel System',
      'Filters',
      'Fluids',
      'Tires',
      'Other'
    ]
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  vehicleCompatibility: {
    brands: [{ type: String }], // ['Toyota', 'Honda']
    models: [{ type: String }], // ['Camry', 'Civic']
    years: {
      from: { type: Number },
      to: { type: Number }
    }
  },
  pricing: {
    costPrice: {
      type: Number,
      required: true,
      min: 0
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'RWF'
    }
  },
  inventory: {
    currentStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    minimumStock: {
      type: Number,
      required: true,
      min: 0,
      default: 5
    },
    maximumStock: {
      type: Number,
      min: 0
    },
    location: {
      warehouse: { type: String, default: 'Main Warehouse' },
      shelf: { type: String },
      bin: { type: String }
    }
  },
  specifications: {
    weight: { type: Number }, // in kg
    dimensions: {
      length: { type: Number }, // in cm
      width: { type: Number },
      height: { type: Number }
    },
    material: { type: String },
    color: { type: String },
    warranty: {
      period: { type: Number }, // in months
      terms: { type: String }
    }
  },
  images: [{
    url: { type: String },
    publicId: { type: String },
    description: { type: String }
  }],
  status: {
    type: String,
    enum: ['active', 'discontinued', 'out-of-stock', 'on-order'],
    default: 'active'
  },
  lastRestocked: {
    type: Date
  },
  lastSold: {
    type: Date
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
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

// Indexes for better query performance (partNumber already indexed due to unique: true)
partSchema.index({ name: 'text', description: 'text' })
partSchema.index({ category: 1 })
partSchema.index({ supplier: 1 })
partSchema.index({ 'vehicleCompatibility.brands': 1 })
partSchema.index({ 'inventory.currentStock': 1 })
partSchema.index({ status: 1 })

// Virtual for profit margin
partSchema.virtual('profitMargin').get(function() {
  return this.pricing.sellingPrice - this.pricing.costPrice
})

// Virtual for profit percentage
partSchema.virtual('profitPercentage').get(function() {
  return ((this.pricing.sellingPrice - this.pricing.costPrice) / this.pricing.costPrice * 100).toFixed(2)
})

// Virtual for stock status
partSchema.virtual('stockStatus').get(function() {
  if (this.inventory.currentStock === 0) return 'out-of-stock'
  if (this.inventory.currentStock <= this.inventory.minimumStock) return 'low-stock'
  return 'in-stock'
})

// Method to check if part is compatible with vehicle
partSchema.methods.isCompatibleWith = function(vehicleBrand, vehicleModel, vehicleYear) {
  const { brands, models, years } = this.vehicleCompatibility
  
  const brandMatch = !brands.length || brands.includes(vehicleBrand)
  const modelMatch = !models.length || models.includes(vehicleModel)
  const yearMatch = !years.from || !years.to || (vehicleYear >= years.from && vehicleYear <= years.to)
  
  return brandMatch && modelMatch && yearMatch
}

// Static method to find low stock parts
partSchema.statics.findLowStock = function() {
  return this.find({
    $expr: { $lte: ['$inventory.currentStock', '$inventory.minimumStock'] },
    status: 'active'
  }).populate('supplier', 'name contactPerson phone email')
}

// Static method to search parts
partSchema.statics.searchParts = function(query, category, vehicleBrand) {
  const searchQuery = { status: 'active' }
  
  if (query) {
    searchQuery.$text = { $search: query }
  }
  
  if (category && category !== 'All') {
    searchQuery.category = category
  }
  
  if (vehicleBrand && vehicleBrand !== 'All') {
    searchQuery['vehicleCompatibility.brands'] = vehicleBrand
  }
  
  return this.find(searchQuery).populate('supplier', 'name')
}

module.exports = mongoose.model('Part', partSchema)
