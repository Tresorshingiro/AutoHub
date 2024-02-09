import React from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const PurchaseList = () => {
  return (
    <div className="container">
      <section className="header">
        <div className='lg'>
          <h1>AutoHub</h1>
        </div>
        <div className='placeholder'>
          <h3>Accountant</h3>
        </div>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
      </section>
      {/* Navigation Links */}
      <div className='nav-links'>
       <AccountantNav/>
      </div>
      <div className='box'>
      <div className='add'>
        <h3>Add Purchase</h3>
        <Link to='/AddPurchase'>
        <button className='addbtn'> <img src='/add.png'/> </button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseList;
