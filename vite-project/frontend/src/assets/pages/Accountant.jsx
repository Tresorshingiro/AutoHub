import React from 'react';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import Cleared from '../components/cleared';
import ClearedAccountant from './ClearedAccountant';

const Accountant = () => {
  return (
    <div className="container">
       <AccountantNav/>
       <ClearedAccountant/>
    </div>
  );
};

export default Accountant;
