import React, { useState } from 'react';
import '../../App.css';                                                                                        
import QuotationNav from '../components/quotationNav';
import AccountantNav from '../components/AccountantNav';

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
        <AccountantNav/>
      <div className='box'>
        <h2><span>Add</span> Item</h2>
        <form  onSubmit={handleSubmit}>
          <div className='fields'>
           <div className='input-field'>
           <label>
            Item Name:
            <input type="text" name="itemName" className='row' placeholder='Item Name' value={itemName} onChange={(e) => setItemName(e.target.value)} required />
           </label>
          </div>
          <div className='input-field'>
          <label>
            Quantity:
            <input type="number" name="quantity" className='row' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Unit Price:
            <input type="number" name="unitPrice" className='row' placeholder='Unit Price' value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Supplier Name:
            <input type="text" name="supplier" className='row' placeholder='Supplier Name' value={supplier} onChange={(e) => setSupplier(e.target.value)} required />
          </label>
          </div>
          </div>
          <button className='large-btn'>Add Item</button>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddPurchase;
