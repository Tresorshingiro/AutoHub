const express = require('express');
// controller functions
const {
  getAllPurchase,
  getPurchaseById,
  createPurchase,
  deletePurchaseById,
  updatePurchaseById,
} = require('../controllers/purchasecontrollers');

const router = express.Router();

// GET all users
router.get('/', getAllPurchase);

// GET a single user
router.get('/:id', getPurchaseById);

// Post a new user
router.post('/', createPurchase);

// Delete a user
router.delete('/:id', deletePurchaseById);

// Update a user (full update)
router.put('/:id', updatePurchaseById);

module.exports = router;
