const Vehicle = require('../models/Vehicles')
const Quotation = require('../models/Quotation')
const Part = require('../models/Parts')
const Supplier = require('../models/Supplier')
const Employee = require('../models/Employee')
const Service = require('../models/Service')
const Expense = require('../models/Expense')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


//login Mechanic
const loginMechanic = async (req, res) => {
    try{
        const {email, password} = req.body
        const employee = await Employee.findOne({email: email, role: "mechanic"})

        if(!employee){
            return res.json({success: false, message: "Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password, employee.password)

        if(isMatch){
            const token = jwt.sign({id:employee._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
            res.json({success: true, token})
        }else{
            res.json({success: false, message: "Invalid Credentials"})
        }
    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Get mechanic profile
const getMechanicProfile = async (req, res) => {
    try {
        const employee = await Employee.findById(req.employee.id).select('-password');
        if (!employee) {
            return res.json({ success: false, message: "Employee not found" });
        }
        res.json({ success: true, employee });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// Get vehicles assigned to mechanic for diagnosis/service
const getAssignedVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      status: { 
        $in: [
          'awaiting-diagnosis',
          'in-progress',
          'waiting-parts',
          'completed',
          'service-completed',
          'quotation-pending',
          'quotation-approved'
        ] 
      }
    }).populate('customer').sort({ createdAt: -1 })
    
    res.json({ success: true, vehicles })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get all parts for selection in quotations
const getAllParts = async (req, res) => {
  try {
    const { search, category, brand, inStock } = req.query
    
    let query = { status: 'active' }
    
    // Search by name or part number
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { partNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category
    }
    
    // Filter by vehicle brand compatibility
    if (brand && brand !== 'All') {
      query['vehicleCompatibility.brands'] = brand
    }
    
    // Filter by stock availability
    if (inStock === 'true') {
      query['inventory.currentStock'] = { $gt: 0 }
    }
    
    const parts = await Part.find(query)
      .populate('supplier', 'name contactPerson phone')
      .sort({ name: 1 })
    
    res.json({ success: true, parts })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Search parts by vehicle compatibility
const searchCompatibleParts = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { search, category } = req.query
    
    const vehicle = await Vehicle.findById(vehicleId)
    if (!vehicle) {
      return res.json({ success: false, message: 'Vehicle not found' })
    }
    
    let query = { 
      status: 'active',
      'inventory.currentStock': { $gt: 0 }
    }
    
    // Add vehicle compatibility
    query.$or = [
      { 'vehicleCompatibility.brands': { $size: 0 } }, // Universal parts
      { 'vehicleCompatibility.brands': vehicle.vehicleBrand }
    ]
    
    if (search) {
      query.$and = [
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { partNumber: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ]
    }
    
    if (category && category !== 'All') {
      query.category = category
    }
    
    const parts = await Part.find(query)
      .populate('supplier', 'name')
      .sort({ name: 1 })
    
    res.json({ success: true, parts })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Create quotation after diagnosis
const createQuotation = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { 
      diagnosis, 
      parts, 
      serviceCharge = 0,
      includeVAT = false,
      taxRate = 18,
      discountAmount = 0 
    } = req.body
    const mechanicId = req.employee.id

    // Validate parts availability
    for (let part of parts) {
      const partDoc = await Part.findById(part.partId)
      if (!partDoc) {
        return res.json({ success: false, message: `Part ${part.description} not found` })
      }
      if (partDoc.inventory.currentStock < part.quantity) {
        return res.json({ 
          success: false, 
          message: `Insufficient stock for ${part.description}. Available: ${partDoc.inventory.currentStock}` 
        })
      }
    }

    // Generate quotation number
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const count = await Quotation.countDocuments({
      createdAt: {
        $gte: new Date(year, new Date().getMonth(), 1),
        $lt: new Date(year, new Date().getMonth() + 1, 1)
      }
    })
    const quotationNumber = `QT-${year}${month}-${String(count + 1).padStart(4, '0')}`

    const quotation = new Quotation({
      quotationNumber,
      vehicleId,
      mechanicId,
      diagnosis,
      parts: parts.map(part => ({
        ...part,
        totalPrice: part.quantity * part.unitPrice
      })),
      serviceCharge,
      summary: {
        includeVAT,
        taxRate,
        discountAmount
      }
    })

    await quotation.save()

    // Update vehicle status
    await Vehicle.findByIdAndUpdate(vehicleId, {
      status: 'quotation-pending'
    })

    // Populate the quotation for response
    await quotation.populate([
      { path: 'vehicleId', populate: { path: 'customer' } },
      { path: 'mechanicId', select: 'name email' },
      { path: 'parts.partId', select: 'name partNumber category' }
    ])

    res.json({ success: true, quotation })
  } catch (error) {
    console.error('Error creating quotation:', error)
    res.json({ success: false, message: error.message })
  }
}

// Get quotations for mechanic
const getQuotations = async (req, res) => {
  try {
    const mechanicId = req.employee.id
    const { status } = req.query
    
    let query = { mechanicId }
    if (status) {
      query.status = status
    }
    
    const quotations = await Quotation.find(query)
      .populate([
        { path: 'vehicleId', populate: { path: 'customer' } },
        { path: 'parts.partId', select: 'name partNumber category' }
      ])
      .sort({ createdAt: -1 })
    
    res.json({ success: true, quotations })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Update quotation
const updateQuotation = async (req, res) => {
  try {
    const { quotationId } = req.params
    const updateData = req.body
    
    const quotation = await Quotation.findById(quotationId)
    if (!quotation) {
      return res.json({ success: false, message: 'Quotation not found' })
    }
    
    if (quotation.status !== 'pending') {
      return res.json({ success: false, message: 'Cannot update quotation that has been approved or rejected' })
    }
    
    const updatedQuotation = await Quotation.findByIdAndUpdate(
      quotationId, 
      updateData, 
      { new: true }
    ).populate([
      { path: 'vehicleId', populate: { path: 'customer' } },
      { path: 'parts.partId', select: 'name partNumber category' }
    ])
    
    res.json({ success: true, quotation: updatedQuotation })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Send quotation to customer
const sendQuotation = async (req, res) => {
  try {
    const { quotationId } = req.params
    
    const quotation = await Quotation.findById(quotationId)
      .populate([
        { path: 'vehicleId', populate: { path: 'customer' } },
        { path: 'mechanicId', select: 'name email' }
      ])
    
    if (!quotation) {
      return res.json({ success: false, message: 'Quotation not found' })
    }
    
    // Here you would typically send email/SMS to customer
    // For now, quotation remains in 'pending' status until mechanic updates it
    
    res.json({ 
      success: true, 
      message: 'Quotation ready for customer review',
      quotation 
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Update quotation status (approve/reject)
const updateQuotationStatus = async (req, res) => {
  try {
    const { quotationId } = req.params
    const { status, notes } = req.body
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.json({ success: false, message: 'Invalid status. Use approved or rejected' })
    }
    
    const quotation = await Quotation.findById(quotationId)
    if (!quotation) {
      return res.json({ success: false, message: 'Quotation not found' })
    }
    
    // Update quotation status
    quotation.status = status
    if (notes) {
      quotation.notes = notes
    }
    
    await quotation.save()
    
    // Update vehicle status based on quotation status
    if (status === 'approved') {
      await Vehicle.findByIdAndUpdate(quotation.vehicleId, {
        status: 'quotation-approved'
      })
    } else if (status === 'rejected') {
      await Vehicle.findByIdAndUpdate(quotation.vehicleId, {
        status: 'awaiting-diagnosis'  // Reset to awaiting diagnosis if quotation rejected
      })
    }
    
    // Populate for response
    await quotation.populate([
      { path: 'vehicleId', populate: { path: 'customer' } },
      { path: 'mechanicId', select: 'name email' },
      { path: 'parts.partId', select: 'name partNumber category' }
    ])
    
    res.json({ 
      success: true, 
      message: `Quotation ${status} successfully`,
      quotation 
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get low stock parts alert
const getLowStockParts = async (req, res) => {
  try {
    const lowStockParts = await Part.findLowStock()
    res.json({ success: true, parts: lowStockParts })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get part details
const getPartDetails = async (req, res) => {
  try {
    const { partId } = req.params
    const part = await Part.findById(partId).populate('supplier')
    
    if (!part) {
      return res.json({ success: false, message: 'Part not found' })
    }
    
    res.json({ success: true, part })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// SERVICE MANAGEMENT FUNCTIONS

// Start service after quotation approval
const startService = async (req, res) => {
  try {
    const { quotationId } = req.params
    const mechanicId = req.employee.id

    // Get the approved quotation
    const quotation = await Quotation.findById(quotationId)
      .populate('vehicleId')
      .populate('parts.partId')

    if (!quotation) {
      return res.json({ success: false, message: 'Quotation not found' })
    }

    if (quotation.status !== 'approved') {
      return res.json({ success: false, message: 'Quotation must be approved before starting service' })
    }

    // Check if service already exists for this quotation
    const existingService = await Service.findOne({ quotationId })
    if (existingService) {
      return res.json({ success: false, message: 'Service already started for this quotation' })
    }

    // Create service items from quotation parts
    const serviceItems = quotation.parts
      .filter(part => part.partId && part.partId._id) // Filter out parts with null partId
      .map(part => ({
        partId: part.partId._id,
        description: part.description,
        quantity: part.quantity,
        status: 'pending'
      }))

    // Generate service number
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const count = await Service.countDocuments({
      createdAt: {
        $gte: new Date(year, new Date().getMonth(), 1),
        $lt: new Date(year, new Date().getMonth() + 1, 1)
      }
    })
    const serviceNumber = `SV-${year}${month}-${String(count + 1).padStart(4, '0')}`

    // Create the service
    const service = new Service({
      serviceNumber,
      vehicleId: quotation.vehicleId._id,
      quotationId: quotation._id,
      mechanicId,
      serviceItems,
      overallStatus: 'started'
    })

    await service.save()

    // Update vehicle status to in-progress
    await Vehicle.findByIdAndUpdate(quotation.vehicleId._id, {
      status: 'in-progress'
    })

    // Reserve parts inventory (reduce stock)
    for (let part of quotation.parts) {
      if (part.partId && part.partId._id) { // Check if partId exists
        await Part.findByIdAndUpdate(part.partId._id, {
          $inc: { 'inventory.currentStock': -part.quantity }
        })
      }
    }

    // Populate service for response
    await service.populate([
      { path: 'vehicleId', populate: { path: 'customer' } },
      { path: 'quotationId' },
      { path: 'mechanicId', select: 'name email' },
      { path: 'serviceItems.partId', select: 'name partNumber' }
    ])

    res.json({ success: true, service })
  } catch (error) {
    console.error('Error starting service:', error)
    res.json({ success: false, message: error.message })
  }
}

// Get all services for mechanic
const getServices = async (req, res) => {
  try {
    const mechanicId = req.employee.id
    const { status } = req.query

    let query = { mechanicId }
    if (status) {
      query.overallStatus = status
    }

    const services = await Service.find(query)
      .populate([
        { path: 'vehicleId', populate: { path: 'customer' } },
        { path: 'quotationId' },
        { path: 'serviceItems.partId', select: 'name partNumber' },
        { path: 'partsUsed.partId', select: 'name partNumber' }
      ])
      .sort({ createdAt: -1 })

    res.json({ success: true, services })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get active services
const getActiveServices = async (req, res) => {
  try {
    const mechanicId = req.employee.id
    const services = await Service.findActiveServices(mechanicId)
    res.json({ success: true, services })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Update service progress
const updateServiceProgress = async (req, res) => {
  try {
    const { serviceId } = req.params
    const { serviceItemId, status, notes, mechanicNote, progress } = req.body

    const service = await Service.findById(serviceId)
    if (!service) {
      return res.json({ success: false, message: 'Service not found' })
    }

    // Update overall progress if provided
    if (progress !== undefined) {
      service.progress = Math.min(100, Math.max(0, progress)) // Ensure progress is between 0-100
      
      // Update overall status based on progress
      if (progress === 0) {
        service.overallStatus = 'started'
      } else if (progress > 0 && progress < 100) {
        service.overallStatus = 'in-progress'
      } else if (progress === 100) {
        service.overallStatus = 'completed'
        service.completedAt = new Date()
      }
      
      await service.save()
    }

    // Update specific service item if provided
    if (serviceItemId) {
      await service.updateServiceItem(serviceItemId, status, notes)
    }

    // Add mechanic note if provided
    if (mechanicNote) {
      await service.addMechanicNote(mechanicNote)
    }

    // If all items are completed, update vehicle status
    if (service.progress === 100) {
      await Vehicle.findByIdAndUpdate(service.vehicleId, {
        status: 'completed',
        paymentStatus: 'unpaid',
        totalAmount: service.quotationId ? service.quotationId.summary?.grandTotal || 0 : 0,
        paidAmount: 0,
        completedAt: new Date()
      })
    }

    // Populate and return updated service
    await service.populate([
      { path: 'vehicleId', populate: { path: 'customer' } },
      { path: 'quotationId' },
      { path: 'serviceItems.partId', select: 'name partNumber' }
    ])

    res.json({ success: true, service })
  } catch (error) {
    console.error('Error updating service progress:', error)
    res.json({ success: false, message: error.message })
  }
}

// Complete service
const completeService = async (req, res) => {
  try {
    const { serviceId } = req.params
    const { serviceNotes, actualPartsUsed, mechanicId } = req.body

    const service = await Service.findById(serviceId)
      .populate('quotationId')
    
    if (!service) {
      return res.json({ success: false, message: 'Service not found' })
    }

    // Update parts used if provided
    if (actualPartsUsed && actualPartsUsed.length > 0) {
      service.partsUsed = actualPartsUsed.map(part => ({
        ...part,
        totalCost: part.quantityUsed * part.unitPrice
      }))

      // Process each part used - create expense records and update inventory
      for (const partUsed of actualPartsUsed) {
        try {
          // Find the part document
          const partDoc = await Part.findById(partUsed.partId)
          if (!partDoc) {
            console.warn(`Part not found: ${partUsed.partId}`)
            continue
          }

          // Create expense record for this part usage
          const expenseRefNumber = `EXP-${Date.now()}-${partDoc.partNumber}`
          const expense = new Expense({
            referenceNumber: expenseRefNumber,
            category: 'parts-purchase',
            supplierId: partDoc.supplier,
            description: `Parts used: ${partDoc.name} (${partUsed.quantityUsed} units) for service ${serviceId}`,
            amount: partUsed.totalCost,
            paymentMethod: 'cash', // Default for internal consumption
            accountantId: mechanicId, // Using mechanic as the one who recorded the expense
            vehicleId: service.vehicleId,
            serviceId: service._id,
            notes: `Automatic expense record for parts consumption during service`
          })
          
          await expense.save()
          console.log(`Expense record created for part ${partDoc.name}: RWF ${partUsed.totalCost}`)

          // Update part inventory
          if (partDoc.inventory && partDoc.inventory.currentStock >= partUsed.quantityUsed) {
            partDoc.inventory.currentStock -= partUsed.quantityUsed
            partDoc.inventory.lastUpdated = new Date()
            await partDoc.save()
            console.log(`Inventory updated for ${partDoc.name}: ${partUsed.quantityUsed} units consumed`)
          } else {
            console.warn(`Insufficient stock for ${partDoc.name}. Current: ${partDoc.inventory?.currentStock || 0}, Needed: ${partUsed.quantityUsed}`)
          }

        } catch (partError) {
          console.error(`Error processing part ${partUsed.partId}:`, partError)
          // Continue with other parts even if one fails
        }
      }
    }

    // Complete the service
    await service.completeService(serviceNotes)

    // Update vehicle status to completed with payment details
    await Vehicle.findByIdAndUpdate(service.vehicleId, {
      status: 'completed',
      paymentStatus: 'unpaid',
      totalAmount: service.quotationId.summary.grandTotal,
      paidAmount: 0,
      completedAt: new Date()
    })

    // Populate for response
    await service.populate([
      { path: 'vehicleId', populate: { path: 'customer' } },
      { path: 'quotationId' },
      { path: 'partsUsed.partId', select: 'name partNumber' }
    ])

    res.json({ 
      success: true, 
      message: 'Service completed successfully. Parts consumption recorded as expenses and inventory updated.',
      service 
    })
  } catch (error) {
    console.error('Service completion error:', error)
    res.json({ success: false, message: error.message })
  }
}

// Get service details
const getServiceDetails = async (req, res) => {
  try {
    const { serviceId } = req.params

    const service = await Service.findById(serviceId)
      .populate([
        { path: 'vehicleId', populate: { path: 'customer' } },
        { path: 'quotationId' },
        { path: 'mechanicId', select: 'name email' },
        { path: 'serviceItems.partId', select: 'name partNumber category' },
        { path: 'partsUsed.partId', select: 'name partNumber category' }
      ])

    if (!service) {
      return res.json({ success: false, message: 'Service not found' })
    }

    res.json({ success: true, service })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Update vehicle status to waiting-parts
const updateVehicleStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { status, notes } = req.body

    // Validate status
    if (!['awaiting-diagnosis', 'in-progress', 'waiting-parts', 'completed'].includes(status)) {
      return res.json({ success: false, message: 'Invalid status provided' })
    }

    const vehicle = await Vehicle.findById(vehicleId)
    if (!vehicle) {
      return res.json({ success: false, message: 'Vehicle not found' })
    }

    // Update vehicle status
    vehicle.status = status
    
    // Set completedAt date if status is completed
    if (status === 'completed') {
      vehicle.completedAt = new Date()
    }
    
    await vehicle.save()

    // Populate for response
    await vehicle.populate('customer')

    res.json({ 
      success: true, 
      message: `Vehicle status updated to ${status}`,
      vehicle 
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Mechanic Dashboard - Get key metrics and summary data
const mechanicDashboard = async (req, res) => {
  try {
    const mechanicId = req.employee.id

    // Get vehicle counts by status
    const vehicleStats = await Vehicle.aggregate([
      {
        $match: {
          status: { $in: ['awaiting-diagnosis', 'quotation-pending', 'quotation-approved', 'in-progress', 'waiting-parts'] }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Get active services count for this mechanic
    const activeServicesCount = await Service.countDocuments({
      mechanicId,
      overallStatus: { $in: ['started', 'in-progress'] }
    })

    // Get pending quotations count for this mechanic
    const pendingQuotationsCount = await Quotation.countDocuments({
      mechanicId,
      status: 'pending'
    })

    // Get approved quotations waiting to start service
    const approvedQuotationsCount = await Quotation.countDocuments({
      mechanicId,
      status: 'approved'
    })

    // Get recent vehicles assigned (last 5)
    const recentVehicles = await Vehicle.find({
      status: { $in: ['awaiting-diagnosis', 'quotation-pending', 'quotation-approved', 'in-progress', 'waiting-parts'] }
    })
      .populate('customer')
      .sort({ createdAt: -1 })
      .limit(5)

    // Get recent quotations (last 5)
    const recentQuotations = await Quotation.find({ mechanicId })
      .populate([
        { path: 'vehicleId', populate: { path: 'customer' } },
        { path: 'parts.partId', select: 'name partNumber' }
      ])
      .sort({ createdAt: -1 })
      .limit(5)

    // Get active services (last 5)
    const activeServices = await Service.find({
      mechanicId,
      overallStatus: { $in: ['started', 'in-progress'] }
    })
      .populate([
        { path: 'vehicleId', populate: { path: 'customer' } },
        { path: 'quotationId' }
      ])
      .sort({ createdAt: -1 })
      .limit(5)

    // Get low stock parts alert
    const lowStockParts = await Part.find({
      $expr: { $lte: ['$inventory.currentStock', '$inventory.minimumStock'] },
      status: 'active'
    })
      .select('name partNumber inventory')
      .limit(10)

    // Format vehicle stats
    const vehicleStatsSummary = {
      awaitingDiagnosis: 0,
      quotationPending: 0,
      quotationApproved: 0,
      inProgress: 0,
      waitingParts: 0
    }

    vehicleStats.forEach(stat => {
      switch (stat._id) {
        case 'awaiting-diagnosis':
          vehicleStatsSummary.awaitingDiagnosis = stat.count
          break
        case 'quotation-pending':
          vehicleStatsSummary.quotationPending = stat.count
          break
        case 'quotation-approved':
          vehicleStatsSummary.quotationApproved = stat.count
          break
        case 'in-progress':
          vehicleStatsSummary.inProgress = stat.count
          break
        case 'waiting-parts':
          vehicleStatsSummary.waitingParts = stat.count
          break
      }
    })

    const dashboard = {
      summary: {
        totalVehiclesAssigned: vehicleStatsSummary.awaitingDiagnosis + vehicleStatsSummary.quotationPending + vehicleStatsSummary.quotationApproved + vehicleStatsSummary.inProgress + vehicleStatsSummary.waitingParts,
        activeServices: activeServicesCount,
        pendingQuotations: pendingQuotationsCount,
        approvedQuotations: approvedQuotationsCount,
        lowStockAlerts: lowStockParts.length
      },
      vehicleStats: vehicleStatsSummary,
      recentActivity: {
        vehicles: recentVehicles,
        quotations: recentQuotations,
        services: activeServices
      },
      alerts: {
        lowStockParts
      }
    }

    res.json({ success: true, dashboard })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = {
  loginMechanic,
  getMechanicProfile,
  mechanicDashboard,
  getAssignedVehicles,
  getAllParts,
  searchCompatibleParts,
  createQuotation,
  getQuotations,
  updateQuotation,
  sendQuotation,
  updateQuotationStatus,
  updateVehicleStatus,
  getLowStockParts,
  getPartDetails,
  // Service functions
  startService,
  getServices,
  getActiveServices,
  updateServiceProgress,
  completeService,
  getServiceDetails
}
