const express = require('express')
const { 
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
} = require('../controllers/accountantController')
const authAccountant = require('../middlewares/authAccountant')

const accountantRouter = express.Router()

accountantRouter.post('/login', loginAccountant)
accountantRouter.get('/profile', authAccountant, getAccountantProfile)

// Dashboard
accountantRouter.get('/dashboard', authAccountant, accountantDashboard)

// Payment management
accountantRouter.get('/vehicles/cleared', authAccountant, getClearedVehicles)
accountantRouter.patch('/vehicles/:vehicleId/payment', authAccountant, updatePaymentStatus)
accountantRouter.post('/vehicles/:vehicleId/invoice', authAccountant, createInvoice)

// Supplier management
accountantRouter.get('/suppliers', authAccountant, getSuppliers)
accountantRouter.post('/suppliers', authAccountant, addSupplier)
accountantRouter.put('/suppliers/:supplierId', authAccountant, updateSupplier)
accountantRouter.delete('/suppliers/:supplierId', authAccountant, deleteSupplier)

// Parts management
accountantRouter.get('/parts/inventory', authAccountant, getPartsInventory)
accountantRouter.get('/parts', authAccountant, getParts)
accountantRouter.post('/parts', authAccountant, addPart)
accountantRouter.put('/parts/:partId', authAccountant, updatePart)
accountantRouter.delete('/parts/:partId', authAccountant, deletePart)
accountantRouter.patch('/parts/:partId/inventory', authAccountant, updatePartInventory)

// Income management
accountantRouter.get('/income', authAccountant, getIncomeRecords)
accountantRouter.post('/income', authAccountant, createIncomeRecord)
accountantRouter.put('/income/:incomeId', authAccountant, updateIncomeRecord)
accountantRouter.delete('/income/:incomeId', authAccountant, deleteIncomeRecord)

// Expense management
accountantRouter.get('/expenses', authAccountant, getExpenseRecords)
accountantRouter.post('/expenses', authAccountant, createExpenseRecord)
accountantRouter.put('/expenses/:expenseId', authAccountant, updateExpenseRecord)
accountantRouter.delete('/expenses/:expenseId', authAccountant, deleteExpenseRecord)

// Reports
accountantRouter.get('/reports/monthly', authAccountant, getMonthlyReport)
accountantRouter.get('/reports/overall', authAccountant, getOverallReport)

module.exports = accountantRouter
