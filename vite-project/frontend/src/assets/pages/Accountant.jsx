import React from 'react';
import '../../App.css';

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
      <div className="nav-links">
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Accountant</h2>
        </div>
        <button className='button'>
          <img src='/mark.png'/>
          Cleared vehicles
          </button>
        <button className='button'>
          <img src='/invoice.png'/>
          Invoices
          </button>
        <div className="dropdown">
          <button className="button">
            <img src='/inventory.png'/>
            Inventory
            </button>
          <div className="dropdown-content">
            <button className='btn'>Suppliers</button>
            <button className='btn'>Purchase</button>
            <button className='btn'>Stock</button>
          </div>
        </div>

      </div>
      <div className='box'></div>
    </div>
  );
};

export default Accountant;
