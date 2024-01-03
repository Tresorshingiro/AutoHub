import React from 'react';
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
      <button className='button'>Dashboard</button>
      <button className='button'>Sales</button>
      <button className='button'>Manage User</button>
      <button className='button'>Manage Services</button>
      <button className='button'>Prices</button>
      <button className='button'>Customers</button>
      <button className='button'>Suppliers</button>
   </div>
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
      </div>
   
  );
};
export default Admin;