import React, { useState, useEffect } from 'react';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { useAuthContext } from '../hooks/useAuthContext';

const getLoc = "http://localhost:3000/api/suppliers/";

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [measurement_unit, setMeasurementUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getLoc, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers');
        }
        const data = await response.json();
        if (data && Array.isArray(data.suppliers)) {
          setSuppliers(data.suppliers);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (err) {
        console.error('Error fetching data:', err); // Log error for debugging
        setError(err.message || 'An error occurred while fetching data.');
        setSuppliers([]); // Ensure suppliers is an array in case of error
      } finally {
        setLoading(false);
      }
    };
    

    if (user) {
      fetchData();
      setError(null)
    } else {
      setError('You must be logged in');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      setError('You must be logged in');
      return;
    }
  
    const item = { itemName, quantity, measurement_unit, unitPrice, supplier };
  
    try {
      const response = await fetch('http://localhost:3000/api/stock/addItem', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred while processing your request.');
        setSuccess(null);
      } else {
        setItemName('');
        setQuantity('');
        setMeasurementUnit('');
        setUnitPrice('');
        setSupplier(''); // Reset supplier
        setError(null);
        setSuccess('Item added successfully');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setError('An unexpected error occurred. Please try again later');
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
      case 'measurement_unit':
        setMeasurementUnit(value); // Fix this line
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
                <input type="text" name="itemName" className='row' placeholder='Item Name' value={itemName} onChange={handleInputChange} required />
              </label>
            </div>
            <div className='input-field'>
              <label>
                Quantity:
                <input type="number" name="quantity" className='row' placeholder='Quantity' value={quantity} onChange={handleInputChange} required />
              </label>
            </div>
            <div className='input-field'>
              <label>
                Measurement Unit:
                <select name='measurement_unit' className='row' value={measurement_unit} onChange={handleInputChange} required>
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
                <input type="number" name="unitPrice" className='row' placeholder='Unit Price' value={unitPrice} onChange={handleInputChange} required />
              </label>
            </div>
            <div className='input-field'>
              <label>
                Supplier Name:
                <select name="supplier" className='row' value={supplier} onChange={handleInputChange}>
                  <option value=''>Select Supplier</option>
                  {Array.isArray(suppliers) && suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>{supplier.company_name}</option>
                  ))}
                </select>
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
