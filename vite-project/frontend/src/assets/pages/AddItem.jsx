import React, { useState } from 'react';
import '../../App.css';                                                                                        
import QuotationNav from '../components/quotationNav';

const AddPurchase = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/purchase/', {
        method: 'POST',
        body: JSON.stringify({ itemName, quantity, unitPrice, supplier }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error:', response.statusText);
        const errorData = await response.json(); // If error response contains JSON data
        console.error('Error Details:', errorData);
        throw new Error(errorData.error);
      }

      const json = await response.json();

      setItemName('');
      setQuantity('');
      setUnitPrice('');
      setSupplier('');
      setError(null);
      setSuccess('Purchase added successfully');
      console.log('new Purchase added', json);
    } catch (error) {
      console.error('Caught an error:', error.message);
      setError(error.message);
      setSuccess(null);
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
        <QuotationNav />
      </div>
      <div className='box'>
        <h2>Add Item</h2>
        <form className='addsupplier' onSubmit={handleSubmit}>
          <label>
            Item Name:
            <input type="text" name="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </label>
          <label>
            Unit Price:
            <input type="number" name="unitPrice" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
          </label>
          <label>
            Supplier:
            <input type="text" name="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} required />
          </label>
          <button type="submit">Add Purchase</button>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddPurchase;
