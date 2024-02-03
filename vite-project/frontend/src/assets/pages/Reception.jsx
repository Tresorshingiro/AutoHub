import React, { useEffect, useState } from 'react';
import {NavLink} from 'react-router-dom';
import '../../App.css';
import ReceptionForm from '../components/receptionForm';
import ReceptionNav from '../components/receptionNav';

const Reception = () => {

  return (
    <div className="container">
      <section className="header">
        <div className='lg'>
          <h1>AutoHub</h1>
        </div>
        <div className='placeholder'>
          <h3>Reception</h3>
        </div>
        <div className="user-icon">
        <img src="/user.png" alt="User Icon" />
        </div>
      </section>
      <div className="nav-links">
       <ReceptionNav/>
      </div>
    <div className='box'>
      <h2>Car Registration</h2>
      <ReceptionForm />
    </div>
 </div>
);
}

export default Reception;