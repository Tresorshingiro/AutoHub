import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const Admin = () => {
  return(
    <div className="reception-container">
    <section className="header">
       <div className='lg'>
         <h1>AutoHub</h1>
       </div>
     </section>
   {/* Navigation Links */}
   <div className="nav-links">
     <Link to="/reception/car-registration">
      <button className='btn'>Car Registration</button>
     </Link>
     <Link to="/reception/in-service-vehicles">
      <button className='btn'>In-service Vehicles</button>
       </Link>
     <Link to="/reception/cleared-vehicles">
       <button className='btn'>Cleared Vehicles</button>
       </Link>
   </div>
   </div>
  );
};
export default Admin;