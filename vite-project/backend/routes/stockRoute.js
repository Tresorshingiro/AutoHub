const express = require('express');
// controller functions
const {
  getAllStock,
  getStockById,
  createStock,
  deleteStockById,
  updateStockById,
} = require('../controllers/stock_controllers');

const router = express.Router();

// GET all users
router.get('/', getAllStock);

// GET a single user
router.get('/:id', getStockById);

// Post a new user
router.post('/', createStock);

// Delete a user
router.delete('/:id', deleteStockById);

// Update a user (full update)
router.put('/:id', updateStockById);

module.exports = router;
