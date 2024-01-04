import React from 'react';
import '../../App.css';

const Owner = () => {
    return(
        <div className="container">
        <section className="header">
           <div className='lg'>
             <h1>AutoHub</h1>
           </div>
           <div className='placeholder'>
             <h3>Owner</h3>
           </div>
           <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
         </section>
       {/* Navigation Links */}
       <div className="nav-links">
       <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Owner</h2>
        </div>
          <button className='button'>Manage Users</button>
          <button className='button'>Manage Services</button>
           <button className='button'>Updates</button>
            <button className='button'>Users</button>
       </div>
       </div>
    );
};

export default Owner;