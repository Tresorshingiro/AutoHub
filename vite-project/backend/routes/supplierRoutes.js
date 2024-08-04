const express = require('express');
// controller functions
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  deleteSupplierById,
  updateSupplierById,
  deleteAllSuppliers,
} = require('../controllers/suppliercontroller');

const router = express.Router();

// GET all suppliers
router.get('/', getAllSuppliers);

// GET a single supplier
router.get('/:id', getSupplierById);

// Post a new supplier
router.post('/', createSupplier);

// Delete a supplier
router.delete('/:id', deleteSupplierById);

// Delete all suppliers
router.delete('/', deleteAllSuppliers);

// Update a supplier (full update)
router.put('/:id', updateSupplierById);

module.exports = router;
