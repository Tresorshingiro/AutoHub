const Stock = require('../models/stockModel');
const Item = require('../models/itemModel');
const mongoose = require('mongoose');

// Get all stocks
const getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.find().populate('item_id').sort({createdAt: -1});
    res.status(200).json(stocks);
    
  } catch (error) {
    console.error('Error getting stocks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Add new item to inventory
const addItemToInventory = async (req, res) => {
  const { itemName, quantity, measurement_unit, unitPrice } = req.body;
  try {
    const newItem = await Item.create({ itemName, measurement_unit, unitPrice });
    const newStock = await Stock.create({ item_id: newItem._id, volume_remaining: quantity });
    res.status(201).json({ message: 'Item added successfully', newItem, newStock });
  } catch (error) {
    console.error('Error adding item to inventory:', error);
    res.status(500).json({ error: 'Failed to add item to inventory' });
  }
};


// Use item in repairing process
const useItem = async (req, res) => {
  const { itemId, usedQuantity } = req.body

  if(!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(404).json({error: 'No such Item'})
  }

  const stock = await Stock.findById(itemId);
  if (!stock) {
    throw new Error('Item not found in stock');
  }
  if (stock.volume_remaining < usedQuantity) {
    throw new Error('Insufficient stock');
  }
  stock.volume_remaining -= usedQuantity;
  await stock.save();
};

// Replenish stock
const replenishStock = async (req, res) => {
  const { itemId, addedQuantity } = req.body

  if(!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(404).json({error: 'No such Item'})
  }

  const stock = await Stock.findById(itemId);
  if (!stock) {
    throw new Error('Item not found in stock');
  }
  stock.volume_remaining += addedQuantity;
  await stock.save();
};

module.exports = {
  getAllStock,
  addItemToInventory,
  useItem,
  replenishStock
};
