import React from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';

const Operations = () => {
    return(
        <div className="container">
        <section className="header">
           <div className='lg'>
             <h1>AutoHub</h1>
           </div>
         </section>
       {/* Navigation Links */}
       <div className="nav-links">
         <Link to="/service">
          <button className='button'>In-Service Vehicles</button>
         </Link>
         <Link to="/quotation">
          <button className='button'>Quotation List</button>
           </Link>
         <Link to="/cleared">
           <button className='button'>Cleared Vehicles</button>
           </Link>
       </div>
       </div>
    );
};

export default Operations;