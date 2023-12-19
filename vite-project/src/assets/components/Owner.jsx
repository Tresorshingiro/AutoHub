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
         <Link to="/#">
          <button className='button'>Manage Users</button>
         </Link>
         <Link to="/#">
          <button className='button'>Manage Services</button>
           </Link>
         <Link to="/#">
           <button className='button'>Updates</button>
           </Link>
           <Link to="/#">
            <button className='button'>Users</button>
           </Link>
       </div>
       </div>
    );
};

export default Owner;