import React from 'react';
import '../../App.css';

const Portals = () => {
  return (
    <div>
      <div className='logo'>
        <h1>AutoHub</h1>
      </div>
    <div className="login-container">
      <h2>Login</h2>
      <div className='portal-container'>
        <div className='portal'>
          <div className='iconimage'>
            <img src="/Reception.png" alt="Reception Icon"/>
          </div>
          <div className='textportal'>
            <h3>Reception</h3>
          </div>
        </div>
        <div className='portal'>
          <div className='iconimage'>
            <img src="/operations.png" alt="operations Icon"/>
          </div>
          <div className='textportal'>
            <h3>Operations</h3>
          </div>
        </div>
        <div className='portal'>
          <div className='iconimage'>
            <img src="/Management.png" alt="Management Icon"/>
          </div>
          <div className='textportal'>
            <h3>Management</h3>
          </div>
        </div>
        <div className='portal'>
          <div className='iconimage'>
            <img src="/Accountant.png" alt="Accountant Icon"/>
          </div>
          <div className='textportal'>
            <h3>Accountant</h3>
          </div>
        </div>
      </div>
      
  
      <div className='btn-container'>
        <button className='btn'>
          Administration 
        </button>
        <button className='btn'>
          Owner
        </button>

      </div>
    </div>
  </div>
  );
};

export default Portals;
