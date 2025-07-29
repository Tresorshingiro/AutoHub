const express = require('express')
const {
    loginManager,
    getManagerProfile,
    managerDashboard,
    getOperationsData,
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getPayrolls,
    generatePayroll,
    downloadPayrollCSV,
    getSuppliersWithParts,
    generateManagerReports
} = require('../controllers/managerController')
const authManager = require('../middlewares/authManager')
const upload = require('../middlewares/multer')

const managerRouter = express.Router()

// Authentication routes
managerRouter.post('/login', loginManager)
managerRouter.get('/profile', authManager, getManagerProfile)

// Dashboard routes
managerRouter.get('/dashboard', authManager, managerDashboard)

// Operations monitoring routes
managerRouter.get('/operations', authManager, getOperationsData)

// Employee management routes
managerRouter.get('/employees', authManager, getEmployees)
managerRouter.post('/employees', authManager, upload.single('image'), addEmployee)
managerRouter.patch('/employees/:employeeId', authManager, upload.single('image'), updateEmployee)
managerRouter.delete('/employees/:employeeId', authManager, deleteEmployee)

// Payroll management routes
managerRouter.get('/payrolls', authManager, getPayrolls)
managerRouter.post('/payrolls', authManager, generatePayroll)
managerRouter.get('/payrolls/:year/:month/download', authManager, downloadPayrollCSV)

// Supplier management routes
managerRouter.get('/suppliers-with-parts', authManager, getSuppliersWithParts)

// Reports routes
managerRouter.get('/reports', authManager, generateManagerReports)

module.exports = managerRouter
