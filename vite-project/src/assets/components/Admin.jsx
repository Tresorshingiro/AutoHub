import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const Admin = () => {
  return(
    <div className="container">
    <section className="header">
       <div className='lg'>
         <h1>AutoHub</h1>
       </div>
       <div className='placeholder'>
          <h3>Admin</h3>
        </div>
       <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
     </section>
   {/* Navigation Links */}
   <div className="nav-links">
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Admin</h2>
        </div>
     <Link to="/reception">
      <button className='button'>Car Registration</button>
     </Link>
     <Link to="/inservice">
      <button className='button'>In-service Vehicles</button>
       </Link>
     <Link to="/cleared-vehicles">
       <button className='button'>Cleared Vehicles</button>
       </Link>
   </div>
   <div className='portal-container'>
        <Link to="/reception" className='portal'>
          <div className='iconimage'>
            <img src="/Reception.png" alt="Reception Icon"/>
          </div>
          <div className='textportal'>
            <h3>Reception</h3>
          </div>
        </Link>
        <Link to="/operations" className='portal'>
          <div className='iconimage'>
            <img src="/operations.png" alt="operations Icon"/>
          </div>
          <div className='textportal'>
            <h3>Operations</h3>
          </div>
        </Link>
        <Link to="/management" className='portal'>
          <div className='iconimage'>
            <img src="/Management.png" alt="Management Icon"/>
          </div>
          <div className='textportal'>
            <h3>Management</h3>
          </div>
        </Link>
        <Link to="/accountant" className='portal'>
          <div className='iconimage'>
            <img src="/Accountant.png" alt="Accountant Icon"/>
          </div>
          <div className='textportal'>
            <h3>Accountant</h3>
          </div>
        </Link>
      </div>
   </div>
   
  );
};
export default Admin;