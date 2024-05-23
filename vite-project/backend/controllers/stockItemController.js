const Stock = require('../models/stockModel');
const Item = require('../models/itemModel');
const Supplier = require('../models/supplierModel')
const mongoose = require('mongoose');

// Get all stocks
const getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find().populate('item_id').populate('supplier').sort({createdAt: -1});
    res.status(200).json(stock);
    
  } catch (error) {
    console.error('Error getting stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Add new item to inventory
const addItemToInventory = async (req, res) => {
  const { itemName, quantity, unitPrice, supplier } = req.body;

  const company_name = supplier
  try {
    const itemExist = await Item.findOne({itemName})
    const supplierExist = await Supplier.findOne({company_name})

    if (itemExist) {
      throw Error('Item already exist in Database')
    }
    else if (!supplierExist) {
      throw Error(`${Supplier} must exist in Database`)
    }
    else {
      supplierId = supplierExist._id;
      const newItem = await Item.create({ itemName, unitPrice });
      const newStock = await Stock.create({ item_id: newItem._id, volume_remaining: quantity, supplier: supplierId });
      res.status(200).json(newItem);
      console.log('New Item added successfully', newItem)
      console.log('Stock updated with new item', newStock)
    }
  }
  catch (error) {
    console.error('Error creating Item', error);
    res.status(400).json({error: error.message})
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
  getAllStock,
  addItemToInventory,
  useItem,
  replenishStock,
  deleteStockItem,
  deleteAllStock
};
