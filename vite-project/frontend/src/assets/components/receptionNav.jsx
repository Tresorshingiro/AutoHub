import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';

const ReceptionNav = () => {
  const [activeButton, setActiveButton] = useState('registration');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div>
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
          <img src='/registration.png'/>
          Car Registration
        </button>
      </NavLink>
      <NavLink
        to='/inservice'
        activeclassname="active-link"
        onClick={() => handleButtonClick('inservice')}
      >
        <button className={`button ${activeButton === 'inservice' ? 'active' : ''}`}>
          <img src='/clipboard.png'/>
          In-service Vehicles
        </button>
      </NavLink>
      <NavLink
        to='/cleared'
        activeclassname="active-link"
        onClick={() => handleButtonClick('cleared')}
      >
        <button className={`button ${activeButton === 'cleared' ? 'active' : ''}`}>
          <img src='/mark.png'/>
          Cleared Vehicles
        </button>
      </NavLink>
    </div>
  );
};

export default ReceptionNav;