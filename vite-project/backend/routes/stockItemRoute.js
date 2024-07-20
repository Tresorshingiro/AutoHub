const express = require('express');
// controller functions
const {
  getAllStock,
  addItemToInventory,
  useItem,
  replenishStock,
  deleteAllStock,
  deleteStockItem
} = require('../controllers/stockItemController');

const router = express.Router();

// GET all stock
router.get('/', getAllStock);

// create new items and stock
router.post('/addItem', addItemToInventory);

// use certin amount of stock
router.put('/useItem', useItem);

// Replenish stock
router.put('/replenish', replenishStock);

// Delete stock
router.delete('/:id', deleteStockItem)
router.delete('/', deleteAllStock);

module.exports = router;
