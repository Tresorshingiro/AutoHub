const express = require('express');
// controller functions
const {
  getAllStock,
  addItemToInventory,
  useItem,
  replenishStock
} = require('../controllers/stockItemController');

const router = express.Router();

// GET all users
router.get('/', getAllStock);

// GET a single user
router.post('/addItem', addItemToInventory);

// Post a new user
router.put('/useItem', useItem);

// Delete a user
router.put('/replenish', replenishStock);

module.exports = router;
