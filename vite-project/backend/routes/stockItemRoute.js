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
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

// Require Auth for all Reception car routes
router.use(requireAuth)

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
router.delete('/deleteAll', deleteAllStock);

module.exports = router;
