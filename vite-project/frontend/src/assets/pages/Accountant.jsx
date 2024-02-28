import React from 'react';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import Cleared from '../components/cleared';

const Accountant = () => {
  return (
    <div className="container">
       <AccountantNav/>
      <div className='box'>
        <Cleared/>
      </div>
    </div>
  );
};

export default Accountant;
