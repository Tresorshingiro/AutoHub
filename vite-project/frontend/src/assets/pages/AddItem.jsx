import React, { useState } from 'react';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { useAuthContext } from '../hooks/useAuthContext';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if( !user ) {
      setError('You must be logged in');
      return;
    }

    const item = { itemName, quantity, unitPrice, supplier }

    try{
      const response = await fetch('http://localhost:3000/api/stock/addItem',{
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json(); // If error response contains JSON data
        console.error('Error Details:', errorData);
        setError(errorData.error || 'An error occured while processing your request.');
        setSuccess(null);
      }
      else {
        const json = await response.json();
        setItemName('');
        setQuantity('');
        setUnitPrice('');
        setSupplier('');
        setError(null);
        setSuccess('Item added successfully');
        console.log('new Item added', json);
      }

    } catch (error) {
      console.error('Error occurred:', error);
      setError('An unexpected error occured . Please try again later');
      setSuccess(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'itemName':
        setItemName(value);
        break;
      case 'quantity':
        setQuantity(value);
        break;
      case 'unitPrice':
        setUnitPrice(value);
        break;
      case 'supplier':
        setSupplier(value);
        break;
      default:
        break;
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
            <input 
              type="text" 
              name="itemName" 
              className='row' 
              placeholder='Item Name' 
              value={itemName} 
              onChange={handleInputChange} 
            />
           </label>
          </div>
          <div className='input-field'>
          <label>
            Quantity:
            <input 
              type="number" 
              name="quantity" 
              className='row' 
              placeholder='Quantity' 
              value={quantity} 
              onChange={handleInputChange}
            />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Unit Price:
            <input 
              type="number" 
              name="unitPrice" 
              className='row' 
              placeholder='Unit Price' 
              value={unitPrice} 
              onChange={handleInputChange} 
            />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Supplier Name:
            <input 
              type="text" 
              name="supplier" 
              className='row' 
              placeholder='Supplier Name' 
              value={supplier} 
              onChange={handleInputChange} 
            />
          </label>
          </div>
          </div>
          <button className='large-btn'>Add Item</button>
        {error && <div className="error" style={{ textAlign: "center" }}>{error}</div>}
        {success && <div className="success" style={{ textAlign: "center" }}>{success}</div>}
        </form>
  </div>
</div>
  );
};

export default AddItem;
