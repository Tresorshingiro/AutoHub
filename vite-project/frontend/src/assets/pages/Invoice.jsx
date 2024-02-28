import React from 'react';
import {Link} from 'react-router-dom';
import AccountantNav from '../components/AccountantNav';
import '../../App.css';

const Invoice = () => {
    return(
        <div className="container">
         <AccountantNav/>
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