import React from 'react';
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
          <button className='button'>
            <img src='/registration.png'/>
            Car Registration
            </button>
          <button className='button'>
            <img src='/clipboard.png'/>
            In-service Vehicles
            </button>
           <button className='button'>
            <img src='/mark.png'/>
            Cleared Vehicles
            </button>
       </div>
       <div className='box'>
       <table>
          <thead>
            <tr>
              <th>Vehicle Brand</th>
              <th>Type</th>
              <th>Plate No</th>
              <th>Customer Name</th>
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
                  <div className='tbtn'>
                  <button>
                    <img src='/view.png'/>
                    View
                  </button>
                  <button>
                    <img src='/edit.png'/>
                    Edit
                  </button>
                  <button>
                    <img src='/delete.png'/>
                    Delete
                  </button>
                  </div>
                </td>
              </tr>
          </tbody>
        </table>
       </div>
       </div>
    );
};

export default Inservice;