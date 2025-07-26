const Vehicle = require('../models/Vehicles')
const Service = require('../models/Service')
const Quotation = require('../models/Quotation')
const Part = require('../models/Parts')
const Supplier = require('../models/Supplier')
const Income = require('../models/Income')
const Expense = require('../models/Expense')
const Employee = require('../models/Employee')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//login accountant
const loginAccountant = async (req, res) => {
    try{
        const {email, password} = req.body
        const employee = await Employee.findOne({email: email, role: "accountant"})

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

// Get accountant profile
const getAccountantProfile = async (req, res) => {
  try {
    const accountantId = req.employee.id
    const employee = await Employee.findById(accountantId).select('-password')
    
    if (!employee) {
      return res.json({ success: false, message: 'Accountant not found' })
    }
    
    res.json({ 
      success: true, 
      employee: {
        _id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        address: employee.address,
        gender: employee.gender,
        role: employee.role,
        image: employee.image
      }
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
// VEHICLE PAYMENT MANAGEMENT
// Get completed vehicles (cleared vehicles)
const getClearedVehicles = async (req, res) => {
  try {
    const { paymentStatus, startDate, endDate } = req.query
    
    let query = { 
      status: 'completed',
      completedAt: { $exists: true }
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus
    }
    
    if (startDate && endDate) {
      query.completedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
    
    const vehicles = await Vehicle.find(query)
      .populate('customer')
      .sort({ completedAt: -1 })
    
    res.json({ success: true, vehicles })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { amount, paymentMethod, notes, phoneNumber, accountNumber } = req.body
    const accountantId = req.employee.id
    
    console.log('Payment data received:', { vehicleId, amount, paymentMethod, notes, phoneNumber, accountNumber })
    
    const vehicle = await Vehicle.findById(vehicleId)
      .populate('customer')
    
    if (!vehicle) {
      return res.json({ success: false, message: 'Vehicle not found' })
    }
    
    // Get the service and quotation for this vehicle
    const service = await Service.findOne({ vehicleId }).populate('quotationId')
    const quotation = service?.quotationId
    
    if (!quotation) {
      return res.json({ success: false, message: 'No quotation found for this vehicle' })
    }
    
    // Update vehicle payment details
    const currentPaidAmount = vehicle.paidAmount || 0
    const newPaidAmount = currentPaidAmount + (amount || 0)
    const totalAmount = quotation.summary.grandTotal
    
    vehicle.paidAmount = newPaidAmount
    vehicle.totalAmount = totalAmount
    
    // Determine payment status based on amounts
    if (newPaidAmount >= totalAmount) {
      vehicle.paymentStatus = 'paid'
    } else if (newPaidAmount > 0) {
      vehicle.paymentStatus = 'partially-paid'
    } else {
      vehicle.paymentStatus = 'unpaid'
    }
    
    await vehicle.save()
    
    // Create income record if payment received
    if (amount > 0) {
      // Generate reference number
      const referenceNumber = `INC-${Date.now()}-${vehicle.PlateNo.replace(/\s+/g, '')}`
      
      const income = new Income({
        referenceNumber,
        vehicleId: vehicle._id,
        serviceId: service._id,
        quotationId: quotation._id,
        customerName: vehicle.customer.name,
        vehicleRef: vehicle.PlateNo, // Add vehicle reference
        category: 'service_payment', // Set category for service payments
        amount: amount,
        paymentMethod,
        phoneNumber: paymentMethod === 'mobile_money' ? phoneNumber : undefined,
        accountNumber: ['bank_transfer', 'credit_card'].includes(paymentMethod) ? accountNumber : undefined,
        description: `Payment for ${vehicle.vehicleBrand} ${vehicle.vehicleType} - ${vehicle.PlateNo}`,
        accountantId,
        notes
      })
      
      await income.save()
      console.log('Income record created:', income)
    }
    
    console.log('Vehicle updated:', { 
      id: vehicle._id, 
      paidAmount: vehicle.paidAmount, 
      totalAmount: vehicle.totalAmount,
      paymentStatus: vehicle.paymentStatus 
    })
    
    res.json({ 
      success: true, 
      message: 'Payment recorded successfully',
      vehicle 
    })
  } catch (error) {
    console.error('Payment recording error:', error)
    res.json({ success: false, message: error.message })
  }
}

// Create invoice for vehicle
const createInvoice = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { invoiceNumber, dueDate, notes, taxRate } = req.body
    
    const vehicle = await Vehicle.findById(vehicleId)
      .populate('customer')
    
    if (!vehicle) {
      return res.json({ success: false, message: 'Vehicle not found' })
    }
    
    // Get the service and quotation for this vehicle
    const service = await Service.findOne({ vehicleId }).populate('quotationId')
    const quotation = service?.quotationId
    
    if (!quotation) {
      return res.json({ success: false, message: 'No quotation found for this vehicle' })
    }
    
    // Update vehicle with invoice details
    vehicle.invoiceNumber = invoiceNumber
    vehicle.invoiceDueDate = dueDate
    vehicle.invoiceNotes = notes
    vehicle.taxRate = taxRate || 18
    vehicle.hasInvoice = true
    
    await vehicle.save()
    
    res.json({ 
      success: true, 
      message: 'Invoice created successfully',
      invoice: {
        invoiceNumber,
        dueDate,
        notes,
        taxRate,
        vehicle
      }
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// SUPPLIER MANAGEMENT

// Get all suppliers
const getSuppliers = async (req, res) => {
  try {
    const { status, search } = req.query
    
    let query = {}
    
    if (status) {
      query.status = status
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    const suppliers = await Supplier.find(query).sort({ name: 1 })
    res.json({ success: true, suppliers })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Add new supplier
const addSupplier = async (req, res) => {
  try {
    const supplierData = req.body
    const supplier = new Supplier(supplierData)
    await supplier.save()
    
    res.json({ 
      success: true, 
      message: 'Supplier added successfully',
      supplier 
    })
  } catch (error) {
    if (error.code === 11000) {
      res.json({ success: false, message: 'Supplier email already exists' })
    } else {
      res.json({ success: false, message: error.message })
    }
  }
}

// Create supplier (alias for addSupplier)
const createSupplier = async (req, res) => {
  try {
    const supplierData = req.body
    const supplier = new Supplier(supplierData)
    await supplier.save()
    
    res.json({ 
      success: true, 
      message: 'Supplier created successfully',
      supplier 
    })
  } catch (error) {
    if (error.code === 11000) {
      res.json({ success: false, message: 'Supplier email already exists' })
    } else {
      res.json({ success: false, message: error.message })
    }
  }
}

// Update supplier
const updateSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params
    const updateData = req.body
    
    const supplier = await Supplier.findByIdAndUpdate(
      supplierId, 
      updateData, 
      { new: true }
    )
    
    if (!supplier) {
      return res.json({ success: false, message: 'Supplier not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Supplier updated successfully',
      supplier 
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params
    
    const supplier = await Supplier.findByIdAndDelete(supplierId)
    
    if (!supplier) {
      return res.json({ success: false, message: 'Supplier not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Supplier deleted successfully'
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// PARTS MANAGEMENT

// Get all parts with inventory details
const getPartsInventory = async (req, res) => {
  try {
    const { category, lowStock, search } = req.query
    
    let query = {}
    
    if (category && category !== 'All') {
      query.category = category
    }
    
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$inventory.currentStock', '$inventory.minimumStock'] }
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { partNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    const parts = await Part.find(query)
      .populate('supplier', 'name contactPerson')
      .sort({ name: 1 })
    
    res.json({ success: true, parts })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get all parts (alias for getPartsInventory)
const getParts = async (req, res) => {
  try {
    const { category, lowStock, search } = req.query
    
    let query = {}
    
    if (category && category !== 'All') {
      query.category = category
    }
    
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$quantity', '$minStockLevel'] }
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { partNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    const parts = await Part.find(query)
      .populate('supplier', 'name contactPerson')
      .sort({ name: 1 })
    
    res.json({ success: true, parts })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Add new part
const addPart = async (req, res) => {
  try {
    console.log('addPart called with body:', req.body)
    
    const partData = req.body
    
    // Transform frontend data to backend schema
    const transformedData = {
      name: partData.name,
      category: partData.category,
      partNumber: partData.partNumber,
      description: partData.description,
      location: partData.location,
      supplier: partData.supplier || undefined,
      inventory: {
        currentStock: parseInt(partData.quantity) || 0,
        minimumStock: parseInt(partData.minStockLevel) || 0,
        location: {
          warehouse: partData.location || 'Main Warehouse'
        }
      },
      pricing: {
        costPrice: parseFloat(partData.unitPrice) || 0,
        sellingPrice: parseFloat(partData.unitPrice) || 0,
        currency: 'RWF'
      }
    }
    
    console.log('Transformed data:', transformedData)
    
    const part = new Part(transformedData)
    await part.save()
    
    console.log('Part saved successfully:', part)
    
    res.json({ 
      success: true, 
      message: 'Part added successfully',
      part 
    })
  } catch (error) {
    console.error('Error in addPart:', error)
    if (error.code === 11000) {
      res.json({ success: false, message: 'Part number already exists' })
    } else {
      res.json({ success: false, message: error.message })
    }
  }
}

// Create part (alias for addPart)
const createPart = async (req, res) => {
  try {
    const partData = req.body
    const part = new Part(partData)
    await part.save()
    
    res.json({ 
      success: true, 
      message: 'Part created successfully',
      part 
    })
  } catch (error) {
    if (error.code === 11000) {
      res.json({ success: false, message: 'Part number already exists' })
    } else {
      res.json({ success: false, message: error.message })
    }
  }
}

// Update part
const updatePart = async (req, res) => {
  try {
    const { partId } = req.params
    const updateData = req.body
    
    const part = await Part.findByIdAndUpdate(
      partId, 
      updateData, 
      { new: true }
    )
    
    if (!part) {
      return res.json({ success: false, message: 'Part not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Part updated successfully',
      part 
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Delete part
const deletePart = async (req, res) => {
  try {
    const { partId } = req.params
    
    const part = await Part.findByIdAndDelete(partId)
    
    if (!part) {
      return res.json({ success: false, message: 'Part not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Part deleted successfully'
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Update part inventory
const updatePartInventory = async (req, res) => {
  try {
    const { partId } = req.params
    const { operation, quantity, notes } = req.body // operation: 'add' or 'remove'
    
    const part = await Part.findById(partId)
    if (!part) {
      return res.json({ success: false, message: 'Part not found' })
    }
    
    if (operation === 'add') {
      part.inventory.currentStock += quantity
      part.lastRestocked = new Date()
    } else if (operation === 'remove') {
      if (part.inventory.currentStock < quantity) {
        return res.json({ success: false, message: 'Insufficient stock' })
      }
      part.inventory.currentStock -= quantity
    }
    
    await part.save()
    
    res.json({ 
      success: true, 
      message: `Inventory ${operation === 'add' ? 'increased' : 'decreased'} successfully`,
      part 
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// INCOME MANAGEMENT

// Get all income records
const getIncomeRecords = async (req, res) => {
  try {
    const { startDate, endDate, paymentMethod } = req.query
    
    let query = {}
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
    
    if (paymentMethod) {
      query.paymentMethod = paymentMethod
    }
    
    const incomes = await Income.find(query)
      .populate('vehicleId', 'vehicleBrand vehicleType PlateNo')
      .populate('accountantId', 'name')
      .sort({ date: -1 })
    
    res.json({ success: true, incomes })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Create income record
const createIncomeRecord = async (req, res) => {
  try {
    const incomeData = req.body
    incomeData.accountantId = req.employee.id
    
    // Generate reference number if not provided
    if (!incomeData.referenceNumber) {
      const year = new Date().getFullYear()
      const month = String(new Date().getMonth() + 1).padStart(2, '0')
      const count = await Income.countDocuments({
        createdAt: {
          $gte: new Date(year, new Date().getMonth(), 1),
          $lt: new Date(year, new Date().getMonth() + 1, 1)
        }
      })
      incomeData.referenceNumber = `INC-${year}${month}-${String(count + 1).padStart(4, '0')}`
    }
    
    console.log('Creating income with data:', incomeData)
    
    const income = new Income(incomeData)
    await income.save()
    
    console.log('Income created successfully:', income)
    
    res.json({ 
      success: true, 
      message: 'Income record created successfully',
      income 
    })
  } catch (error) {
    console.error('Income creation error:', error)
    res.json({ success: false, message: error.message })
  }
}

// Update income record
const updateIncomeRecord = async (req, res) => {
  try {
    const { incomeId } = req.params
    const updateData = req.body
    
    const income = await Income.findByIdAndUpdate(
      incomeId, 
      updateData, 
      { new: true }
    )
    
    if (!income) {
      return res.json({ success: false, message: 'Income record not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Income record updated successfully',
      income 
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Delete income record
const deleteIncomeRecord = async (req, res) => {
  try {
    const { incomeId } = req.params
    
    const income = await Income.findByIdAndDelete(incomeId)
    
    if (!income) {
      return res.json({ success: false, message: 'Income record not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Income record deleted successfully'
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// EXPENSE MANAGEMENT

// Get all expense records
const getExpenseRecords = async (req, res) => {
  try {
    const { startDate, endDate, category, supplierId } = req.query
    
    let query = {}
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
    
    if (category) {
      query.category = category
    }
    
    if (supplierId) {
      query.supplierId = supplierId
    }
    
    const expenses = await Expense.find(query)
      .populate('supplierId', 'name')
      .populate('accountantId', 'name')
      .sort({ date: -1 })
    
    res.json({ success: true, expenses })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Add expense record
const addExpense = async (req, res) => {
  try {
    const expenseData = req.body
    expenseData.accountantId = req.employee.id
    
    const expense = new Expense(expenseData)
    await expense.save()
    
    res.json({ 
      success: true, 
      message: 'Expense recorded successfully',
      expense 
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Create expense record (alias for addExpense)
const createExpenseRecord = async (req, res) => {
  try {
    console.log('createExpenseRecord called with body:', req.body)
    console.log('Employee ID from token:', req.employee?.id)
    
    const expenseData = req.body
    expenseData.accountantId = req.employee.id
    
    console.log('Final expense data to save:', expenseData)
    
    const expense = new Expense(expenseData)
    console.log('Created expense model instance')
    
    await expense.save()
    console.log('Expense saved successfully:', expense)
    
    res.json({ 
      success: true, 
      message: 'Expense record created successfully',
      expense 
    })
  } catch (error) {
    console.error('Error in createExpenseRecord:', error)
    res.json({ success: false, message: error.message })
  }
}

// Update expense record
const updateExpenseRecord = async (req, res) => {
  try {
    const { expenseId } = req.params
    const updateData = req.body
    
    const expense = await Expense.findByIdAndUpdate(
      expenseId, 
      updateData, 
      { new: true }
    )
    
    if (!expense) {
      return res.json({ success: false, message: 'Expense record not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Expense record updated successfully',
      expense 
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Delete expense record
const deleteExpenseRecord = async (req, res) => {
  try {
    const { expenseId } = req.params
    
    const expense = await Expense.findByIdAndDelete(expenseId)
    
    if (!expense) {
      return res.json({ success: false, message: 'Expense record not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Expense record deleted successfully'
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// REPORTS

// Generate monthly report
const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query
    
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)
    
    // Get income for the month
    const incomes = await Income.find({
      date: { $gte: startDate, $lte: endDate }
    })
    
    // Get expenses for the month
    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate }
    })
    
    // Get completed vehicles for the month
    const completedVehicles = await Vehicle.countDocuments({
      completedAt: { $gte: startDate, $lte: endDate },
      status: 'completed'
    })
    
    // Calculate totals
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const netProfit = totalIncome - totalExpenses
    
    // Payment method breakdown
    const paymentMethods = {}
    incomes.forEach(income => {
      paymentMethods[income.paymentMethod] = (paymentMethods[income.paymentMethod] || 0) + income.amount
    })
    
    // Expense category breakdown
    const expenseCategories = {}
    expenses.forEach(expense => {
      expenseCategories[expense.category] = (expenseCategories[expense.category] || 0) + expense.amount
    })
    
    const report = {
      period: { year, month, startDate, endDate },
      summary: {
        totalIncome,
        totalExpenses,
        netProfit,
        completedVehicles,
        averageIncomePerVehicle: completedVehicles > 0 ? totalIncome / completedVehicles : 0
      },
      breakdown: {
        paymentMethods,
        expenseCategories
      },
      details: {
        incomes: incomes.length,
        expenses: expenses.length
      }
    }
    
    res.json({ success: true, report })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Generate overall report
const getOverallReport = async (req, res) => {
  try {
    // Total income
    const totalIncome = await Income.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    
    // Total expenses
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    
    // Total vehicles completed
    const totalVehicles = await Vehicle.countDocuments({ status: 'completed' })
    
    // Payment status breakdown
    const paymentStatusBreakdown = await Vehicle.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$paymentStatus', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } }
    ])
    
    // Low stock parts
    const lowStockParts = await Part.find({
      $expr: { $lte: ['$inventory.currentStock', '$inventory.minimumStock'] }
    }).countDocuments()
    
    // Active suppliers
    const activeSuppliers = await Supplier.countDocuments({ status: 'active' })
    
    const incomeTotal = totalIncome[0]?.total || 0
    const expenseTotal = totalExpenses[0]?.total || 0
    
    const report = {
      financial: {
        totalIncome: incomeTotal,
        totalExpenses: expenseTotal,
        netProfit: incomeTotal - expenseTotal,
        profitMargin: incomeTotal > 0 ? ((incomeTotal - expenseTotal) / incomeTotal * 100).toFixed(2) : 0
      },
      operations: {
        totalVehiclesCompleted: totalVehicles,
        averageIncomePerVehicle: totalVehicles > 0 ? incomeTotal / totalVehicles : 0
      },
      inventory: {
        lowStockParts,
        activeSuppliers
      },
      payments: paymentStatusBreakdown
    }
    
    res.json({ success: true, report })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Accountant Dashboard - Get key financial metrics and summary data
const accountantDashboard = async (req, res) => {
  try {
    // Get current month/year for monthly stats
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    const monthStart = new Date(currentYear, currentMonth, 1)
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

    // Get cleared vehicles (completed vehicles) statistics
    const clearedVehiclesStats = await Vehicle.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: { $sum: '$paidAmount' }
        }
      }
    ])

    // Get monthly financial summary
    const monthlyIncome = await Income.aggregate([
      {
        $match: {
          date: { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])

    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])

    // Get overall financial totals
    const overallIncome = await Income.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ])

    const overallExpenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ])

    // Get last 12 months of financial data for charts
    const last12Months = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
      
      last12Months.push({
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        startDate: monthStart,
        endDate: monthEnd
      })
    }

    // Get income and expenses for each month
    const monthlyFinancialData = await Promise.all(
      last12Months.map(async (monthInfo) => {
        const [incomeData, expenseData] = await Promise.all([
          Income.aggregate([
            {
              $match: {
                date: { $gte: monthInfo.startDate, $lte: monthInfo.endDate }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' }
              }
            }
          ]),
          Expense.aggregate([
            {
              $match: {
                date: { $gte: monthInfo.startDate, $lte: monthInfo.endDate }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' }
              }
            }
          ])
        ])

        return {
          month: `${monthInfo.month} ${monthInfo.year}`,
          income: incomeData[0]?.total || 0,
          expenses: expenseData[0]?.total || 0
        }
      })
    )

    // Get inventory alerts
    const lowStockParts = await Part.countDocuments({
      $expr: { $lte: ['$inventory.currentStock', '$inventory.minimumStock'] },
      status: 'active'
    })

    const outOfStockParts = await Part.countDocuments({
      'inventory.currentStock': 0,
      status: 'active'
    })

    // Get supplier statistics
    const activeSuppliers = await Supplier.countDocuments({ status: 'active' })
    const totalSuppliers = await Supplier.countDocuments()

    // Get recent activities (last 5 each)
    const recentPayments = await Income.find()
      .populate('vehicleId', 'vehicleBrand vehicleType PlateNo')
      .populate('accountantId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)

    const recentExpenses = await Expense.find()
      .populate('supplierId', 'name')
      .populate('accountantId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)

    const pendingPayments = await Vehicle.find({
      status: 'completed',
      paymentStatus: { $in: ['unpaid', 'partially-paid'] }
    })
      .populate('customer')
      .sort({ completedAt: -1 })
      .limit(10)

    // Calculate payment statistics
    const paymentStats = {
      unpaid: 0,
      partiallyPaid: 0,
      paid: 0,
      totalUnpaidAmount: 0,
      totalPartialAmount: 0,
      totalPaidAmount: 0
    }

    clearedVehiclesStats.forEach(stat => {
      switch (stat._id) {
        case 'unpaid':
          paymentStats.unpaid = stat.count
          paymentStats.totalUnpaidAmount = stat.totalAmount
          break
        case 'partially-paid':
          paymentStats.partiallyPaid = stat.count
          paymentStats.totalPartialAmount = stat.totalAmount - stat.paidAmount
          break
        case 'paid':
          paymentStats.paid = stat.count
          paymentStats.totalPaidAmount = stat.paidAmount
          break
      }
    })

    // Calculate monthly totals
    const monthlyIncomeTotal = monthlyIncome[0]?.total || 0
    const monthlyExpenseTotal = monthlyExpenses[0]?.total || 0
    const monthlyProfit = monthlyIncomeTotal - monthlyExpenseTotal

    // Calculate overall totals
    const overallIncomeTotal = overallIncome[0]?.total || 0
    const overallExpenseTotal = overallExpenses[0]?.total || 0
    const overallProfit = overallIncomeTotal - overallExpenseTotal

    const dashboard = {
      financial: {
        monthly: {
          income: monthlyIncomeTotal,
          expenses: monthlyExpenseTotal,
          profit: monthlyProfit,
          transactionCount: {
            income: monthlyIncome[0]?.count || 0,
            expenses: monthlyExpenses[0]?.count || 0
          }
        },
        overall: {
          income: overallIncomeTotal,
          expenses: overallExpenseTotal,
          profit: overallProfit,
          profitMargin: overallIncomeTotal > 0 ? ((overallProfit / overallIncomeTotal) * 100).toFixed(2) : 0
        }
      },
      monthlyFinancialData: monthlyFinancialData, // Add 12 months of data for charts
      payments: {
        ...paymentStats,
        totalVehicles: paymentStats.unpaid + paymentStats.partiallyPaid + paymentStats.paid,
        outstandingAmount: paymentStats.totalUnpaidAmount + paymentStats.totalPartialAmount
      },
      inventory: {
        lowStockAlerts: lowStockParts,
        outOfStockAlerts: outOfStockParts,
        suppliers: {
          active: activeSuppliers,
          total: totalSuppliers
        }
      },
      recentActivity: {
        payments: recentPayments,
        expenses: recentExpenses,
        pendingPayments
      },
      alerts: {
        pendingPaymentsCount: pendingPayments.length,
        lowStockCount: lowStockParts,
        outOfStockCount: outOfStockParts
      }
    }

    res.json({ success: true, dashboard })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

module.exports = {
  // Dashboard
  accountantDashboard,

  loginAccountant,
  getAccountantProfile,
  
  // Payment management
  getClearedVehicles,
  updatePaymentStatus,
  createInvoice,
  
  // Supplier management
  getSuppliers,
  addSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  
  // Parts management
  getPartsInventory,
  getParts,
  addPart,
  createPart,
  updatePart,
  deletePart,
  updatePartInventory,
  
  // Income management
  getIncomeRecords,
  createIncomeRecord,
  updateIncomeRecord,
  deleteIncomeRecord,
  
  // Expense management
  getExpenseRecords,
  addExpense,
  createExpenseRecord,
  updateExpenseRecord,
  deleteExpenseRecord,
  
  // Reports
  getMonthlyReport,
  getOverallReport
}
