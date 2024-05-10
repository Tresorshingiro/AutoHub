import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { useAuthContext } from '../hooks/useAuthContext';

const AddSupplier = () => {
  const [company_name, setCompanyName] = useState('');
  const [TIN_no, setTin_no] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const {user} = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const supplier = { company_name, TIN_no, telephone, email, address };

    try {
      const response = await axios.post('http://localhost:3000/api/suppliers/', supplier, {
        headers: {
          'Authorization': `Bearer ${user.token}` // Assuming user is defined somewhere in your component
        }
      });
      
      if (response.ok) {
        const json = await response.json();
        setSuccess('Supplier added successfully');
        setError(null);
        resetForm();
        console.log('New Supplier added', json);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.response.data.error || 'An error occurred');
      setSuccess(null);
    }
  };

  const resetForm = () => {
    setCompanyName('');
    setTin_no('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className="container">
      <AccountantNav />
      <div className='box'>
        <h2><span>Add</span> Supplier</h2>
        <form onSubmit={handleSubmit}>
          <div className='fields'>
            <div className='input-field'>
              <label>
                Supplier Name:
                <input type="text" name="company_name" className='row' placeholder='Supplier Name' value={company_name} onChange={(e) => setCompanyName(e.target.value)} required />
              </label>
            </div>
            <div className='input-field'>
              <label>
                TIN Number:
                <input type="number" name="TIN_no" className='row' placeholder='TIN Number' value={TIN_no} onChange={(e) => setTin_no(e.target.value)} required />
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
                <input type="tel" name="telephone" className='row' placeholder='Tel' value={telephone} onChange={(e) => setPhone(e.target.value)} required />
              </label>
            </div>
            <div className='input-field'>
              <label>
                Address:
                <textarea name="address" className='row' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} required />
              </label>
            </div>
          </div>
          <button onClick={handleSubmit} className='large-btn'>Add Supplier</button>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
