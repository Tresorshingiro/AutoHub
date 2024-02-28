import React, { useEffect, useState } from 'react';
import {NavLink} from 'react-router-dom';
import '../../App.css';
import ReceptionForm from '../components/receptionForm';
import ReceptionNav from '../components/receptionNav';

const Reception = () => {

  return (
    <div className='container'>
    <ReceptionNav/>
    <div className='box'>
      <h2>Car Registration</h2>
      <ReceptionForm />
    </div>
 </div>
);
}

export default Reception;