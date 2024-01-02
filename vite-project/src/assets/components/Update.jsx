import React from 'react';
import '../../App.css';

const Update = () => {
    return(
        <div className="container">
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
       {/* Navigation Links */}
       <div className="nav-links">
           <div className="user-icon">
             <img src="/user.png" alt="User Icon" />
             <h2>Reception</h2>
           </div>
          <button className='button'>Car Registration</button>
          <button className='button'>In-service Vehicles</button>
           <button className='button'>Cleared Vehicles</button>
       </div>
       <div className='box'>
        <div className='pro-container'>
        <div className='details'>
          <h4>Customer Details</h4>
        <div className='pro'>
        <form method='post'>
          <label>
            Owner:<input type="text"name="owner"/>
          </label>
          <label>
           Tel:<input type="tel"name="tel"/>
          </label>
          <label>
            Email:<input type="email"name="email"/>
          </label>
          </form>
        </div>
        </div>
        <div className='details'>
          <h4>Vehicle Details</h4>
        <div className='pro'>
          <form method='post'>
            <label>
          Brand:<input type="text"name="brand"/>
          </label>
          <label>
          Type:<input type="text" name="type"/>
          </label>
          <label>
           PlateNO:<input type="text"name="plateNo"/> 
          </label>
          <label>
            Engine:<input type="text"name="engine"/>
          </label>
          <label>
            Model Year:<input type="text"name="model"/>
          </label>
          </form>
        </div>
        </div>
        </div>
        <div className='buttons'>
        <button>Update</button>
        <button className='btn'>Cancel</button>
        </div>
       </div>
       </div>
    );
};

export default Update;