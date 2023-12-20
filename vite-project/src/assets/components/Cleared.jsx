import React from 'react';
import '../../App.css';

const Cleared = () => {
    return(
        <div className='container'>
        <section className="header">
           <div className='lg'>
             <h1>AutoHub</h1>
           </div>
           <div className='placeholder'>
            <h3>Reception</h3>
           </div>
           <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
         </div>
        </section>
        <div className="nav-links">
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Reception</h2>
        </div>
         <button className='button'>Car Registration</button>
         <button className='button'>In-service Vehicles</button>
          <button className='button'>Cleared Vehicles</button>
      </div>
      <div className='box'></div>
      </div>  
    );
};