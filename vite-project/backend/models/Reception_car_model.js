const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds}T${day}/${month}/${year}`;
};

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
