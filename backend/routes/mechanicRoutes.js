const express = require('express')
const { 
  mechanicDashboard,
  loginMechanic,
  getMechanicProfile,
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
} = require('../controllers/mechanicController')
const authMechanic = require('../middlewares/authMechanic')

const mechanicRouter = express.Router()

mechanicRouter.post('/login', loginMechanic)
mechanicRouter.get('/profile', authMechanic, getMechanicProfile)
// Dashboard
mechanicRouter.get('/dashboard', authMechanic, mechanicDashboard)

// Vehicle management
mechanicRouter.get('/vehicles', authMechanic, getAssignedVehicles)
mechanicRouter.patch('/vehicles/:vehicleId/status', authMechanic, updateVehicleStatus)

// Parts management
mechanicRouter.get('/parts', authMechanic, getAllParts)
mechanicRouter.get('/parts/low-stock', authMechanic, getLowStockParts)
mechanicRouter.get('/parts/:partId', authMechanic, getPartDetails)
mechanicRouter.get('/parts/compatible/:vehicleId', authMechanic, searchCompatibleParts)

// Quotation management
mechanicRouter.get('/quotations', authMechanic, getQuotations)
mechanicRouter.post('/quotations/:vehicleId', authMechanic, createQuotation)
mechanicRouter.patch('/quotations/:quotationId', authMechanic, updateQuotation)
mechanicRouter.patch('/quotations/:quotationId/send', authMechanic, sendQuotation)
mechanicRouter.patch('/quotations/:quotationId/status', authMechanic, updateQuotationStatus)

// Service management
mechanicRouter.get('/services', authMechanic, getServices)
mechanicRouter.get('/services/active', authMechanic, getActiveServices)
mechanicRouter.get('/services/:serviceId', authMechanic, getServiceDetails)
mechanicRouter.post('/services/start/:quotationId', authMechanic, startService)
mechanicRouter.patch('/services/:serviceId/progress', authMechanic, updateServiceProgress)
mechanicRouter.patch('/services/:serviceId/complete', authMechanic, completeService)

module.exports = mechanicRouter
