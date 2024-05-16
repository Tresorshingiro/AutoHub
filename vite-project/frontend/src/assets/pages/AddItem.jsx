import React, {useState, useEffect} from 'react';
import AccountantNav from '../components/AccountantNav';
import { useAuthContext } from '../hooks/useAuthContext';

const AddItem = () => {
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [measurement_unit, setMeasurementUnit] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [supplier, setSupplier] = useState('')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const {user} = useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if( !user ) {
      setError('You must be logged in');
      return;
    }

    const item = { itemName, quantity, measurement_unit, unitPrice};

    try{
      const response = await fetch('http://localhost:3000/api/stock/addItem',{
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
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
    } catch (error) {
      console.error('Error occurred:', error);
      setError('An unexpected error occured . Please try again later');
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

export default AddItem;