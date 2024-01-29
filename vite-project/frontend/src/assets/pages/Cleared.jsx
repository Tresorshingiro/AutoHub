import React from 'react';
import ReceptionNav from '../components/receptionNav';
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
        <ReceptionNav/>
      </div>
      <div className='box'></div>
      </div>  
    );
};

export default Cleared;