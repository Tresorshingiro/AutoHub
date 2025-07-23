const express = require('express')
const { 
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
} = require('../controllers/accountantController')
const authAccountant = require('../middlewares/authAccountant')

const accountantRouter = express.Router()

accountantRouter.post('/login', loginAccountant)
// Dashboard
accountantRouter.get('/dashboard', authAccountant, accountantDashboard)

// Payment management
accountantRouter.get('/vehicles/cleared', authAccountant, getClearedVehicles)
accountantRouter.patch('/vehicles/:vehicleId/payment', authAccountant, updatePaymentStatus)

// Supplier management
accountantRouter.get('/suppliers', authAccountant, getSuppliers)
accountantRouter.post('/suppliers', authAccountant, addSupplier)
accountantRouter.patch('/suppliers/:supplierId', authAccountant, updateSupplier)

// Parts management
accountantRouter.get('/parts/inventory', authAccountant, getPartsInventory)
accountantRouter.post('/parts', authAccountant, addPart)
accountantRouter.patch('/parts/:partId/inventory', authAccountant, updatePartInventory)

// Income management
accountantRouter.get('/income', authAccountant, getIncomeRecords)

// Expense management
accountantRouter.get('/expenses', authAccountant, getExpenseRecords)
accountantRouter.post('/expenses', authAccountant, addExpense)

// Reports
accountantRouter.get('/reports/monthly', authAccountant, getMonthlyReport)
accountantRouter.get('/reports/overall', authAccountant, getOverallReport)

module.exports = accountantRouter
