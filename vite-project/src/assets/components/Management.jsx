import React from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';

const Management = () => {
    return(
        <div className="container">
        <section className="header">
           <div className='lg'>
             <h1>AutoHub</h1>
           </div>
         </section>
       {/* Navigation Links */}
       <div className="nav-links">
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
       </div>
    );
};

export default Management;