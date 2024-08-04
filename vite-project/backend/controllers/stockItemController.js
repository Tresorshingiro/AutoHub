const Stock = require('../models/stockModel');
const Item = require('../models/itemModel');
const Supplier = require('../models/supplierModel');
const mongoose = require('mongoose');

// Get all Items
const getAllItems = async (req, res) => {
  try {
    const item = await Item.find().populate('supplier').sort({ createdAt: -1 });
    res.status(200).json(item);
  } catch (error) {
    console.error('Error getting stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all stocks
const getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find()
      .populate({
        path: 'item_id',
        populate: { path: 'supplier' } // Populate the supplier field within item_id
      }).sort({createdAt: -1});
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error getting stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Add new item to inventory
const addItemToInventory = async (req, res) => {
  const { itemName, quantity, unitPrice, measurement_unit, supplier } = req.body;

  console.log('Request body:', req.body); // Log the incoming request body

  try {
    // Check if item already exists
    const itemExist = await Item.findOne({ itemName });
    if (itemExist) {
      return res.status(400).json({ error: 'Item already exists in the database' });
    }

    // Check if supplier exists
    const supplierExist = await Supplier.findOne({ _id: supplier });
    console.log('Supplier found:', supplierExist); // Log the result of the supplier lookup
    if (!supplierExist) {
      return res.status(400).json({ error: 'Supplier must exist in the database' });
    }

    // Create the new item
    const newItem = new Item({
      itemName,
      unitPrice,
      measurement_unit,
      supplier: supplierExist._id
    });

    const savedItem = await newItem.save();

    // Create the new stock entry
    const newStock = new Stock({
      item_id: savedItem._id,
      volume_remaining: quantity
    });

    await newStock.save();

    res.status(201).json(savedItem);
    console.log('New Item added successfully', savedItem);
    console.log('Stock updated with new item', newStock);
  } catch (error) {
    console.error('Error creating Item:', error);
    res.status(400).json({ error: error.message });
  }
};

// Use item in repairing process
const useItem = async (req, res) => {
  const { itemId, usedQuantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(404).json({ error: 'Invalid item ID' });
  }

  try {
    const stock = await Stock.findOne({ item_id: itemId });
    if (!stock) {
      return res.status(404).json({ error: 'Item not found in stock' });
    }
    if (stock.volume_remaining < usedQuantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    stock.volume_remaining -= usedQuantity;
    await stock.save();

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Error using item', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Replenish stock
const replenishStock = async (req, res) => {
  const { itemId, addedQuantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(404).json({ error: 'Invalid item ID' });
  }

  try {
    const stock = await Stock.findOne({ item_id: itemId });
    if (!stock) {
      return res.status(404).json({ error: 'Item not found in stock' });
    }

    stock.volume_remaining += addedQuantity;
    await stock.save();

    res.status(200).json({ message: 'Stock replenished successfully' });
  } catch (error) {
    console.error('Error replenishing stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a stock item
const deleteStockItem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Stock Item' });
  }

  const deletedStock = await Stock.findByIdAndDelete(id);

  if (!deletedStock) {
    return res.status(404).json({ error: 'No such Stock Item' });
  }

  res.status(200).json({ message: 'Stock Item deleted successfully' });
};

const deleteAllStock = async (req, res) => {
  try {
    const deletedStocks = await Stock.deleteMany({}); // Empty filter deletes all
    res.status(200).json({ message: `${deletedStocks.deletedCount} stock(s) deleted successfully.` });
  } catch (error) {
    console.error('Error deleting stocks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllItems,
  getAllStock,
  addItemToInventory,
  useItem,
  replenishStock,
  deleteStockItem,
  deleteAllStock
};
