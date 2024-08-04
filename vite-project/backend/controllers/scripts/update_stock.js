const mongoose = require('mongoose');
const Stock = require('../../models/stockModel');
const Item = require('../../models/itemModel');  // Import the Item model
const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

const MONGO_URI = process.env.MONGO_URI;

const updateStockValues = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Ensure that the Item model is registered
    mongoose.model('Item', Item.schema);

    const stocks = await Stock.find().populate('item_id');
    for (const stock of stocks) {
      if (stock.item_id) {
        stock.total_value = stock.item_id.unitPrice * stock.volume_remaining;
        await stock.save();
      }
    }

    console.log('Stock values updated successfully.');
  } catch (error) {
    console.error('Error updating stock values:', error);
  } finally {
    await mongoose.disconnect();
  }
};

updateStockValues();
