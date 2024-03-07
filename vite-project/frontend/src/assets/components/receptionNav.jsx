import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaFile } from 'react-icons/fa';
import { FaTools } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import '../../App.css';

const ReceptionNav = () => {
  const [activeButton, setActiveButton] = useState('registration');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
      <div>
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
      <div className="user-icon">
        <img src="/user.png" alt="User Icon" />
        <h2>Reception</h2>
      </div>
      <NavLink
        to='/reception'
        activeclassname="active-link"
        onClick={() => handleButtonClick('registration')}
      >
        <button className={`button ${activeButton === 'registration' ? 'active' : ''}`}>
          <FaFile  className={activeButton === 'registration' ? 'black-on-click' : ''}/>
          Car Registration
        </button>
      </NavLink>
      <NavLink
        to='/inservice'
        activeclassname="active-link"
        onClick={() => handleButtonClick('inservice')}
      >
        <button className={`button ${activeButton === 'inservice' ? 'active' : ''}`}>
          <FaTools className={activeButton === 'inservice' ? 'black-on-click' : ''}/>
          In-service Vehicles
        </button>
      </NavLink>
      <NavLink
        to='/cleared'
        activeclassname="active-link"
        onClick={() => handleButtonClick('cleared')}
      >
        <button className={`button ${activeButton === 'cleared' ? 'active' : ''}`}>
          <FaCheckCircle className={activeButton ==='cleared' ? 'black-on-click' : ''}/>
          Cleared Vehicles
        </button>
      </NavLink>
      </div>
    </div>
  );
};

export default ReceptionNav;