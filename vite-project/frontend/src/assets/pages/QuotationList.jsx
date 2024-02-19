import React, { useState, useEffect } from 'react';
import Quotation from './Quotation';
import '../../App.css';
import QuotationNav from '../components/quotationNav';

const QuotationList = () => {
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
      <QuotationNav/>
    </div>
    <div className='box'>
    <div className="quotation-list">
      <h2>Quotation List</h2>
      <table>
        <thead>
          <tr>
          <th>Date</th>
          <th>Plate No</th>
          <th>Customer Name</th>
          <th>Furniture to buy</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>VAT</th>
          <th>Total Price</th>
          <th>Action</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td className='tbtn'>
                <button>Edit</button>
                <button>Approval</button>
              </td>
            </tr>
        </tbody>
      </table>
    </div>
    </div>
    </div>
 );
};

export default QuotationList;