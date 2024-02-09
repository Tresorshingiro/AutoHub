import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const AddSupplier = () => {
  const [supplierData, setSupplierData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to add a new supplier
      const response = await axios.post('http://localhost:3000/AddSupplier', supplierData);
      console.log('Supplier added successfully:', response.data);

    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  return (
    <div className="container">
      <section className="header">
        <div className='lg'>
          <h1>AutoHub</h1>
        </div>
        <div className='placeholder'>
          <h3>Accountant</h3>
        </div>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
      </section>
      {/* Navigation Links */}
      <div className='nav-links'>
       <AccountantNav/>
      </div>
      <div className='box'>
        <h2>Add Supplier</h2>
        <form  className='addsupplier' onSubmit={handleSubmit}>
          <label>
            Supplier Name:
            <input type="text" name="name" value={supplierData.name} onChange={handleInputChange} required />
          </label>
          <label>
            Contact Person:
            <input type="text" name="contactPerson" value={supplierData.contactPerson} onChange={handleInputChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={supplierData.email} onChange={handleInputChange} required />
          </label>
          <label>
            Phone:
            <input type="tel" name="phone" value={supplierData.phone} onChange={handleInputChange} required />
          </label>
          <label>
            Address:
            <textarea name="address" value={supplierData.address} onChange={handleInputChange} required />
          </label>
          <button type="submit">Add Supplier</button>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
