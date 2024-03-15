import React from 'react';
import {Link} from 'react-router-dom';
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
        <Link to={`/signin?role=Reception`}>
          <div className='iconimage'>
            <img src="/Reception.png" alt="Reception Icon"/>
          </div>
          <div className='textportal'>
            <h3>Reception</h3>
          </div>
          </Link>
        </div>

        <div className='portal'>
        <Link to={`/signin?role=Operations`}>
          <div className='iconimage'>
            <img src="/operations.png" alt="operations Icon"/>
          </div>
          <div className='textportal'>
            <h3>Operations</h3>
          </div>
          </Link>
        </div>
        
        <div className='portal'>
        <Link to={`/signin?role=Management`}>
          <div className='iconimage'>
            <img src="/Management.png" alt="Management Icon"/>
          </div>
          <div className='textportal'>
            <h3>Management</h3>
          </div>
          </Link>
        </div>

        <div className='portal'>
        <Link to={`/signin?role=Accountant`}>
          <div className='iconimage'>
            <img src="/Accountant.png" alt="Accountant Icon"/>
          </div>
          <div className='textportal'>
            <h3>Accountant</h3>
          </div>
          </Link>
        </div>

        <div className='portal'>
        <Link to={`/signin?role=Admin`}>
          <div className='iconimage'>
            <img src="/user.png" alt="Accountant Icon"/>
          </div>
          <div className='textportal'>
            <h3>Admin</h3>
          </div>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Portals;