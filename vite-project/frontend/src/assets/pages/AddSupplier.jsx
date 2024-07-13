import React, { useState } from 'react';
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
      const response = await fetch('http://localhost:3000/api/supplier/', {
        method: 'POST',
        body: JSON.stringify(supplier),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occured while processing your request.')
        setSuccess(null);
      } else {
        const json = await response.json();
        setCompanyName('');
        setTin_no('');
        setEmail('');
        setPhone('');
        setAddress('');
        setError(null);
        setSuccess('Supplier added successfully!');
        console.log('New supplier added', json);
      }

    } catch (error) {
      console.error('Error:', error.message);
      setError(error.response.data.error || 'An unexpected error occurred. Please try again later.');
      setSuccess(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'company_name':
        setCompanyName(value);
        break;
      case 'TIN_no':
        setTin_no(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'telephone':
        setPhone(value);
        break;
      case 'address':
        setAddress(value);
        break;
      default:
        break;
    }
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
                <input 
                  type="text" 
                  name="company_name" 
                  className='row' 
                  placeholder='Supplier Name'
                  onChange={handleInputChange} 
                  value={company_name} 
                />
              </label>
            </div>
            <div className='input-field'>
              <label>
                TIN Number:
                <input 
                  type="number" 
                  name="TIN_no" 
                  className='row' 
                  placeholder='TIN Number' 
                  onChange={handleInputChange} 
                  value={TIN_no}  
                />
              </label>
            </div>
            <div className='input-field'>
              <label>
                Email:
                <input 
                  type="email" 
                  name="email" 
                  className='row' 
                  placeholder='Email' 
                  onChange={handleInputChange}
                  value={email} 
                />
              </label>
            </div>
            <div className='input-field'>
              <label>
                Tel:
                <input 
                  type="tel" 
                  name="telephone" 
                  className='row' 
                  placeholder='Tel' 
                  onChange={handleInputChange}
                  value={telephone} 
                />
              </label>
            </div>
            <div className='input-field'>
              <label>
                Address:
                <input 
                  name="address" 
                  className='row' 
                  placeholder='Address' 
                  onChange={handleInputChange}
                  value={address} 
                />
              </label>
            </div>
          </div>

          <button className='large-btn'>Add Supplier</button>
          {error && <div className="error" style={{ textAlign: "center" }}>{error}</div>}
          {success && <div className="success" style={{ textAlign: "center" }}>{success}</div>}

        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
