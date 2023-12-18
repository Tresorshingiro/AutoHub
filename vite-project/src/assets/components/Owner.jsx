import React from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';

const Owner = () => {
    return(
        <div className="container">
        <section className="header">
           <div className='lg'>
             <h1>AutoHub</h1>
           </div>
         </section>
       {/* Navigation Links */}
       <div className="nav-links">
         <Link to="/reception/car-registration">
          <button className='button'>Car Registration</button>
         </Link>
         <Link to="/reception/in-service-vehicles">
          <button className='button'>In-service Vehicles</button>
           </Link>
         <Link to="/reception/cleared-vehicles">
           <button className='button'>Cleared Vehicles</button>
           </Link>
       </div>
       </div>
    );
};

export default Owner;