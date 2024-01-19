import React, { useState, useEffect } from 'react';
import Quotation from './Quotation';
import '../../App.css';

const QuotationList = () => {
 const [quotations, setQuotations] = useState([]);

 useEffect(() => {
    fetchQuotations();
 }, []);

 const fetchQuotations = async () => {
    // Replace with your API call to fetch quotations
    const response = await fetch('/api/quotations');
    const data = await response.json();
    setQuotations(data);
 };
 const handleView = (quotation) => {
    setSelectedQuotation(quotation);
 };

 const handleEdit = (quotation) => {
    // Navigate to the EditQuotation component
 };
 const handleApproval = async (quotation) => {
    // Update the state of the quotation to 'approved'
    // Replace with your own API call implementation
    const response = await fetch(`/api/quotations/${quotation.id}/approve`, {
      method: 'PUT',
    });

    if (response.ok) {
      setQuotations(quotations.filter(q => q.id !== quotation.id));
    }
 };

 return (
    <div className="container">
    <section className="header">
      <div className='lg'>
        <h1>AutoHub</h1>
      </div>
      <div className='placeholder'>
        <h3>Operations</h3>
      </div>
      <div className="user-icon">
        <img src="/user.png" alt="User Icon" />
      </div>
    </section>
    {/* Navigation Links */}
    <div className="nav-links">
      <div className="user-icon">
        <img src="/user.png" alt="User Icon" />
        <h2>Operations</h2>
      </div>
      <button className='button'>In-Service Vehicles</button>
      <button className='button'>Quotation List</button>
      <button className='button'>Cleared Vehicles</button>
    </div>
    <div className='box'>
    <div className="quotation-list">
      <h2>Quotation List</h2>
      <table>
        <thead>
          <tr>
            <th>Plate No</th>
            <th>Customer Name</th>
            <th>Vehicle Brand</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((quotation, index) => (
            <tr key={index}>
              <td>{quotation.plateNo}</td>
              <td>{quotation.customerName}</td>
              <td>{quotation.vehicleBrand}</td>
              <td>{quotation.date}</td>
              <td>
                <button onClick={() => handleView(quotation)}>View</button>
                <button onClick={() => handleEdit(quotation)}>Edit</button>
                <button onClick={() => handleApproval(quotation)}>Approval</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
 );
};

export default QuotationList;