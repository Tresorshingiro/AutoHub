const Supplier = require('../models/stockModel');
const mongoose =require('mongoose');

// Get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    console.error('Error getting suppliers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get one supplier by ID
const getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    console.error('Error getting supplier by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new supplier
const createSupplier = async (req, res) => {
  const supplierData = req.body;
  try {
    const newSupplier = await Supplier.create(supplierData);
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a supplier by ID
const updateSupplierById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a supplier by ID
const deleteSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(deletedSupplier);
  } catch (error) {
    console.error('Error deleting supplier by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplierById,
  deleteSupplierById,
};
