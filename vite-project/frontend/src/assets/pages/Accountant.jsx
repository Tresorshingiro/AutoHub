import React from 'react';
import '../../App.css';

const Accountant = () => {
    return(
        <div className="container">
        <section className="header">
           <div className='lg'>
             <h1>AutoHub</h1>
           </div>
           <div className='placeholder'>
            <h3>Accountant</h3>
           </div>
           <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
           </div>
         </section>
       {/* Navigation Links */}
       <div className="nav-links">
       <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Accountant</h2>
        </div>
          <button className='button'>Payment Portal</button>
          <button className='button'>Suppliers Management</button>
       </div>
       <div className='box'></div>
       </div>
    );
};

export default Accountant;