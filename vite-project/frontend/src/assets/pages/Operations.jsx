import React from 'react';
import QuotationNav from '../components/quotationNav';
import '../../App.css';

const Operations = () => {
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
        <QuotationNav/>
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
                  <div className='tbtn'>
                  <button>View</button>
                  <button>Add Quotation</button>
                  </div>
                </td>
              </tr>
          </tbody>
        </table>
       </div>
       </div>
    );
};

export default Operations;