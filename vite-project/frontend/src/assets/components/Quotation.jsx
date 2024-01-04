import React from 'react';
import '../../App.css';

const Quotation = () => {
    return(
        <div className="container">
        <section className="header">
           <div className='lg'>
             <h1>AutoHub</h1>
           </div>
           <div className='placeholder'>
            <h3>Operations</h3>
           </div>
           <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
         </section>
       {/* Navigation Links */}
       <div className="nav-links">
       <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Operations</h2>
        </div>
          <button className='button'>In-Service Vehicles</button>
          <button className='button'>Quotation List</button>
           <button className='button'>Cleared Vehicles</button>
       </div>
       <div className='box'>
       <table>
          <thead>
            <tr>
              <th>PlateNO</th>
              <th>Property of</th>
              <th>Furniture to Buy</th>
              <th>Amount Billed</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            <tr>
                <td>Total</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
          </tbody>
        </table>
       </div>
       </div>
    );
};

export default Quotation;