import React from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';

const Inservice = ({ inServiceVehicles }) => {
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
         <Link to="/car-registration">
          <button className='button'>Car Registration</button>
         </Link>
         <Link to="/inservice">
          <button className='button'>In-service Vehicles</button>
           </Link>
         <Link to="/cleared-vehicles">
           <button className='button'>Cleared Vehicles</button>
           </Link>
       </div>
       <div className='box'>
       <table>
          <thead>
            <tr>
              <th>Vehicle Brand</th>
              <th>Type</th>
              <th>Plate No</th>
              <th>Owner</th>
              <th>Date</th>
              <th>Engine</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <button>View</button>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
          </tbody>
        </table>
       </div>
       </div>
    );
};

export default Inservice;