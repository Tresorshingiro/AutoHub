import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const AddSupplier = () => {
  const [name, setName] = useState('')
  const [tin, setTin] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Perform actions with vehicleInfo data, e.g., send it to a server
    const supplier = { name, tin, contactPerson, phone, email, address }

    const response = await fetch('http://localhost:3000/api/suppliers/', {
      method: 'POST',
      body: JSON.stringify({name, tin, contactPerson, phone, email, address}),
      headers: {
        'Content-Type': 'application/json'
      }
     });

     if(!response.ok) {
      console.error('Error:', response.statusText);
      const errorData = await response.json(); // If error response contains JSON data
      console.error('Error Details:', errorData);
      setError(errorData);
      setSuccess(null)
    }
    if(response.ok) {
      const json = await response.json()

      setName('')
      setTin('')
      setContactPerson('')
      setEmail('')
      setPhone('')
      setAddress('')
      setError(null)
      setSuccess('supplier added successfully')
      console.log('new Supplier added', json)
    }
  }


  return (
    <div className="container">
       <AccountantNav/>
      <div className='box'>
        <h2><span>Add</span> Supplier</h2>
        <form  onSubmit={handleSubmit}>
         <div className='fields'>
          <div className='input-field'>
          <label>
            Supplier Name:
            <input type="text" name="name" className='row' placeholder='Supplier Name' value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            TIN Number:
            <input type="number" name="tin" className='row' placeholder='TIN Number' value={tin} onChange={(e) => setTin(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Contact Person:
            <input type="text" name="contactPerson" className='row' placeholder='Contact Person' value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Email:
            <input type="email" name="email" className='row' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Tel:
            <input type="tel" name="phone" className='row' placeholder='Tel' value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Address:
            <textarea name="address" className='row' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} required />
          </label>
          </div>
          </div>
          <button className='large-btn'>Add Supplier</button>
          {error && <div className="error">{error.error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  );
}

export default AddSupplier;
