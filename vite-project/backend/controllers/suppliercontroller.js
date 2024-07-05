const Supplier = require('../models/supplierModel');
const mongoose =require('mongoose');

// Get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({createdAt: -1});

    const supplierCount = new Set(suppliers.map(Supplier => String(Supplier._id))).size;

    res.status(200).json({suppliers, supplierCount});
  } catch (error) {
    console.error('Error getting suppliers:', error);
    res.status(400).json({ error: 'Internal Server Error' });
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
    res.status(400).json({ error: 'Internal Server Error' });
  }
};

// Create a new supplier
const createSupplier = async (req, res) => {
  const { company_name, TIN_no, telephone, email, address } = req.body;
  try {
    const nameExist = await Supplier.findOne({company_name})
    const emailExist = await Supplier.findOne({email})
    const tinExist = await Supplier.findOne({TIN_no})

    if (nameExist) {
      throw Error('Supplier name already in use')
    }
    else if (tinExist) {
      throw Error('TIN number already in use')
    } 
    else if (emailExist) {
      throw Error('Email already in use')
    }
    else {
      const newSupplier = await Supplier.create({company_name, TIN_no, telephone, email, address});
      res.status(200).json(newSupplier);
      console.log('New supplier added', newSupplier);
    }
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: 'Internal Server Error' });
  }
};

// Delete a supplier by ID
const deleteSupplierById = async (req, res) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Supplier'})
  }

  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(deletedSupplier);
  } catch (error) {
    console.error('Error deleting supplier by ID:', error);
    res.status(400).json({ error: 'Error deleting supplier by ID' });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplierById,
  deleteSupplierById,
};
