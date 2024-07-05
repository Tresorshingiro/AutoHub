const express = require('express');
// controller functions
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  deleteSupplierById,
  updateSupplierById,
} = require('../controllers/suppliercontroller');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

// Require Auth for all Reception car routes
router.use(requireAuth)

// GET all users
router.get('/', getAllSuppliers);

// GET a single user
router.get('/:id', getSupplierById);

// Post a new user
router.post('/', createSupplier);

// Delete a user
router.delete('/:id', deleteSupplierById);

// Update a user (full update)
router.put('/:id', updateSupplierById);

module.exports = router;
