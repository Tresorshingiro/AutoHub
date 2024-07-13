<<<<<<< HEAD
import React, { useState } from 'react';
import '../../App.css';
=======
import React, {useState, useEffect} from 'react';
>>>>>>> 24301a51cec7b4bccaf44a5419404a9b28a259be
import AccountantNav from '../components/AccountantNav';
import { useAuthContext } from '../hooks/useAuthContext';

const getLoc = "http://localhost:3000/api/supplier/";

const AddItem = () => {
<<<<<<< HEAD
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [measurement_unit, setMeasurementUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [suppliers, setSuppliers] = useState([]); // Initialize as an empty array
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
=======
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [measurement_unit, setMeasurementUnit] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [supplier, setSupplier] = useState('')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const {user} = useAuthContext()
>>>>>>> 24301a51cec7b4bccaf44a5419404a9b28a259be

  const handleSubmit = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    const item = { itemName, quantity, unitPrice, supplier }

    try {
      const response = await fetch('http://localhost:3000/api/stock/addItem', {
=======
    if( !user ) {
      setError('You must be logged in');
      return;
    }

    const item = { itemName, quantity, measurement_unit, unitPrice};

    try{
      const response = await fetch('http://localhost:3000/api/stock/addItem',{
>>>>>>> 24301a51cec7b4bccaf44a5419404a9b28a259be
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
<<<<<<< HEAD
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred while processing your request.');
        setSuccess(null);
      } else {
        const json = await response.json();
        setItemName('');
        setQuantity('');
        setMeasurementUnit('');
        setUnitPrice('');
        setSupplier(''); // Clear the supplier field
        setError(null);
        setSuccess('Item added successfully');
        console.log('New Item', json);
      }

=======
        }
      });

      if(!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred  while processing your request.');
        setSuccess(null);
      } else {
        const json = await response.json();
        setItemName('');
        setQuantity('');
        setMeasurementUnit('');
        setUnitPrice('');
        setError(null);
        setSuccess('Item added Successfully');
        console.log('New Item', json);
      }
>>>>>>> 24301a51cec7b4bccaf44a5419404a9b28a259be
    } catch (error) {
      console.error('Error occurred:', error);
      setError('An unexpected error occurred. Please try again later');
      setSuccess(null);
    }
  };
<<<<<<< HEAD

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
      <AccountantNav />
      <div className='box'>
        <h2><span>Add</span> Item</h2>
        <form onSubmit={handleSubmit}>
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
                Measurement Unit:
                <select name='measurement_unit' className='row' value={measurement_unit} onChange={(e) => setMeasurementUnit(e.target.value)} required>
                  <option value=''>Select Measurement</option>
                  <option value='litre'>Litre</option>
                  <option value='kilogram'>Kilogram</option>
                  <option value='other'>Other</option>
                </select>
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
                <select name="supplier" className='row' placeholder='Supplier Name' value={supplier} onChange={(e) => setSupplier(e.target.value)} required>
                  <option value=''>Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier.company_name}>{supplier.company_name}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <button className='large-btn'>Add Item</button>
        {error && <div className="error" style={{ textAlign: "center" }}>{error}</div>}
        {success && <div className="success" style={{ textAlign: "center" }}>{success}</div>}
        </form>
=======
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
>>>>>>> 24301a51cec7b4bccaf44a5419404a9b28a259be
      </div>
      <div className='input-field'>
      <label>
        Quantity:
        <input type="number" name="quantity" className='row' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </label>
      </div>
      <div className='input-field'>
      <label>
        Measurement Unit:
        <select name='measurement_unit' value={measurement_unit} onChange={(e) => setMeasurementUnit(e.target.value)} required>
          <option value=''>Select Measurement</option>
          <option value='litre'>Litre</option>
          <option value='kilogram'>Kilogram</option>
          <option value='other'>Other</option>
        </select>
      </label>
      </div>
      <div className='input-field'>
      <label>
        Unit Price:
        <input type="number" name="unitPrice" className='row' placeholder='Unit Price' value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
      </label>
      </div>
   {/*   <div className='input-field'>
      <label>
        Supplier Name:
        <input type="text" name="supplier" className='row' placeholder='Supplier Name' value={supplier} onChange={(e) => setSupplier(e.target.value)} />
      </label>
</div>*/}
      </div>
      <button className='large-btn'>Add Item</button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  </div>
</div>
  );
};

<<<<<<< HEAD
export default AddItem;
=======
export default AddItem;
>>>>>>> 24301a51cec7b4bccaf44a5419404a9b28a259be
