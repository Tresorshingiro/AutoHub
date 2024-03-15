const mongoose = require('mongoose');
const { formatDate } = require('../controllers/functions/formatDate')

const Schema = mongoose.Schema;

const receptionCar = new Schema({
  owner: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  plate: {
    type: String,
    required: true
  },
  insurance: {
    type: String,
    required: true
  },
  telephone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: String,
    default: () => formatDate(new Date())
  },
  updatedAt: {
    type: String,
    default: () => formatDate(new Date())
  },
  date: {
    type: String,
    get: formatDate, // Getter method to format the date when retrieving from the database
    set: (val) => val // Setter method to handle date assignments (no need for modification here)
  }
});

module.exports = mongoose.model('receptionCar', receptionCar); // Collection name
