import React from 'react';
import {NavLink} from 'react-router-dom';
import '../../App.css';

const AccountantNav = () => {
    return(
      <div>
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
      <div className='nav-links'>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Accountant</h2>
        </div>
        <NavLink to='/cleared'>
        <button className='button'>
          <img src='/mark.png'/>
          Cleared vehicles
        </button>
        </NavLink>
        <NavLink to='/invoice'>
        <button className='button'>
          <img src='/invoice.png'/>
          Invoices
        </button>
        </NavLink>
        <NavLink to='/suppliers'>
          <button className="button">
            <img src='/supplier.png'/>
            Suppliers
          </button>
        </NavLink>
        <NavLink to='/purchase'>
          <button className='button'>
            <img src='/checklist.png'/>
            Purchase
          </button>
        </NavLink>
        <NavLink to='/stock'>
          <button className='button'>
            <img src='/in-stock.png'/>
            Stock
          </button>
        </NavLink>
       </div>
      </div> 
    );
};

export default AccountantNav;