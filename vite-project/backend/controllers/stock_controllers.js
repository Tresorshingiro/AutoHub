const Stock = require('../models/stockModel');
const mongoose = require('mongoose');

// Get all stocks
const getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    console.error('Error getting stocks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get one stock by ID
const getStockById = async (req, res) => {
  const { id } = req.params;
  try {
    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(stock);
  } catch (error) {
    console.error('Error getting stock by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new stock
const createStock = async (req, res) => {
  const stockData = req.body;
  try {
    const newStock = await Stock.create(stockData);
    res.status(201).json(newStock);
  } catch (error) {
    console.error('Error creating stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a stock by ID
const updateStockById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedStock = await Stock.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedStock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(updatedStock);
  } catch (error) {
    console.error('Error updating stock by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a stock by ID
const deleteStockById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStock = await Stock.findByIdAndDelete(id);
    if (!deletedStock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(deletedStock);
  } catch (error) {
    console.error('Error deleting stock by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllStock,
  getStockById,
  createStock,
  updateStockById,
  deleteStockById,
};
