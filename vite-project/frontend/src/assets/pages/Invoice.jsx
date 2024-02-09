import React from 'react';
import {Link} from 'react-router-dom';
import AccountantNav from '../components/AccountantNav';
import '../../App.css';

const Invoice = () => {
    return(
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
          <h3>Add Invoice</h3>
          <Link to='/AddInvoice'>
          <button className='addbtn'> <img src='/add.png'/> </button>
          </Link>
          </div>
        </div>
      </div>
    );
};

export default Invoice;