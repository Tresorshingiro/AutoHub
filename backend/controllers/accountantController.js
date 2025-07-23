const Vehicle = require('../models/Vehicles')
const Service = require('../models/Service')
const Quotation = require('../models/Quotation')
const Part = require('../models/Parts')
const Supplier = require('../models/Supplier')
const Income = require('../models/Income')
const Expense = require('../models/Expense')
const Employee = require('../models/Employee')

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
    const { paymentStatus, paidAmount, paymentMethod, notes } = req.body
    const accountantId = req.employee.id
    
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
    vehicle.paymentStatus = paymentStatus
    vehicle.paidAmount = paidAmount || vehicle.paidAmount
    vehicle.totalAmount = quotation.summary.grandTotal
    
    await vehicle.save()
    
    // Create income record if payment received
    if (paidAmount > 0) {
      const income = new Income({
        vehicleId: vehicle._id,
        serviceId: service._id,
        quotationId: quotation._id,
        customerName: vehicle.customer.name,
        amount: paidAmount,
        paymentMethod,
        description: `Payment for ${vehicle.vehicleBrand} ${vehicle.vehicleType} - ${vehicle.PlateNo}`,
        accountantId,
        notes
      })
      
      await income.save()
    }
    
    res.json({ 
      success: true, 
      message: 'Payment status updated successfully',
      vehicle 
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

// Add new part
const addPart = async (req, res) => {
  try {
    const partData = req.body
    const part = new Part(partData)
    await part.save()
    
    res.json({ 
      success: true, 
      message: 'Part added successfully',
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
  
  // Payment management
  getClearedVehicles,
  updatePaymentStatus,
  
  // Supplier management
  getSuppliers,
  addSupplier,
  updateSupplier,
  
  // Parts management
  getPartsInventory,
  addPart,
  updatePartInventory,
  
  // Income management
  getIncomeRecords,
  
  // Expense management
  getExpenseRecords,
  addExpense,
  
  // Reports
  getMonthlyReport,
  getOverallReport
}
