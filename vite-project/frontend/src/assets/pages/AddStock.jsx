import React, {useState} from 'react';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const AddStock = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [category, setCategory] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/stock/', {
        method: 'POST',
        body: JSON.stringify({ itemName, quantity, unitPrice, category }),
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
      setCategory('');
      setError(null);
      setSuccess('Stock added successfully');
      console.log('new Stock added', json);
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
      <h2><span>Add</span> Stock</h2>
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
            <input type="number" name="quantity" className='row' placeholder='Item Name' value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
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
            Category:
            <input type="text" name="category" className='row' placeholder='Category' value={category} onChange={(e) => setCategory(e.target.value)} required />
          </label>
          </div>
          </div>
          <button className='large-btn'>Add Stock</button>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddStock;
