import React from 'react';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import Cleared from '../components/cleared';

const Accountant = () => {
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
        <Cleared/>
      </div>
    </div>
  );
};

export default Accountant;
