const Customer = require('../models/customerModel')
const mongoose = require('mongoose')
const io = require('../server')

// Getting all customer details
const getAllCustomers = async (req, res) => {
  try{
    const customerData = await Customer.find({}).sort({createdAt: -1})

    res.status(200).json({customerData})
  } catch(error){
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Getting a single customer
const getOneCustomer = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Customer'})
    }

    const customer = await Customer.findById(id)

    if(!customer) {
        return res.status(404).json({error: 'No such Customer'})
    }

    res.status(200).json(customer)
}

// Creating a customer details
const createCustomer = async (req, res) => {
    try {
        const { names, telephone, email, address, TIN_no, true_client } = req.body
        const customer = await Customer.create({names, telephone, email, address, TIN_no, true_client})
    
        res.status(200).json(customer)
    } catch (error) {
        console.error('Error: ', error)
        res.status(200).json({error: error.message})
    }
}

// Deleting a customer
const deleteCustomer = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Customer'})
    }

    const customer = await Customer.findOneAndDelete({_id: id})

    if(!customer) {
        return res.status(404).json({error: 'No such customer'})
    }
    res.status(200).json(customer)
}

const deleteAllCustomers = async (req, res) => {
    try {
        const deletedCustomers = await Customer.deleteMany({});
        res.status(200).json({message: `${deletedCustomers.deletedCount} customer (s) deleted successfully.`})
    } catch (error) {
        console.error('Error deleting customers: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a customer

const updateCustomer = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid Customer ID' });
    }

    try {

    }
    catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = {
    getAllCustomers,
    getOneCustomer,
    createCustomer,
    deleteCustomer,
    deleteAllCustomers,
    updateCustomer
}