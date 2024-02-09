import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';

const QuotationNav = () => {
  return (
    <div>
      <div className="user-icon">
        <img src="/user.png" alt="User Icon" />
        <h2>Operations</h2>
      </div>
      <NavLink to='/operations' activeClassName="active-link">
        <button className='button'>
            <img src='/clipboard.png'/>
            Add Quotation
        </button>
      </NavLink>
      <NavLink to='/quotationlist' activeClassName="active-link">
        <button className='button'>
            <img src='/list.png'/>
            Quotation List
        </button>
      </NavLink>
      <NavLink to='/cleared' activeClassName="active-link">
        <button className='button'>
        <img src='/mark.png'/>
            Cleared Vehicles
        </button>
      </NavLink>
    </div>
  );
}

export default QuotationNav;
