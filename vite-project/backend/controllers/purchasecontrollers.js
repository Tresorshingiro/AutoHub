const Purchase = require('../models/Purchase');
const mongoose =require('mongoose');

// Get all suppliers
const getAllPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.find();
    res.json(purchase);
  } catch (error) {
    console.error('Error getting suppliers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get one supplier by ID
const getPurchaseById = async (req, res) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(purchase);
  } catch (error) {
    console.error('Error getting supplier by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new supplier
const createPurchase = async (req, res) => {
  const purchase = req.body;
  try {
    const newPurchase = await Purchase.create(purchase);
    res.status(201).json(newPurchase);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a supplier by ID
const updatePurchaseById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedPurchase) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(updatedPurchase);
  } catch (error) {
    console.error('Error updating supplier by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a supplier by ID
const deletePurchaseById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(id);
    if (!deletedPurchase) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(deletedPurchase);
  } catch (error) {
    console.error('Error deleting supplier by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllPurchase,
  getPurchaseById,
  createPurchase,
  updatePurchaseById,
  deletePurchaseById,
};
