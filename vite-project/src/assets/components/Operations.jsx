import React from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';

const Operations = () => {
    return(
      <div className='special'>
        <div className="reception-container">
        <section className="header">
           <div className='lg'>
             <h1>AutoHub</h1>
           </div>
         </section>
       {/* Navigation Links */}
       <div className="nav-links">
         <Link to="/service">
          <button className='btn'>In-Service Vehicles</button>
         </Link>
         <Link to="/quotation">
          <button className='btn'>Quotation List</button>
           </Link>
         <Link to="/cleared">
           <button className='btn'>Cleared Vehicles</button>
           </Link>
       </div>
       </div>
  </div>
    );
};

export default Operations;