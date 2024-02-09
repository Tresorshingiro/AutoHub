import React from 'react';
import QuotationNav from '../components/quotationNav';
import '../../App.css';
import { useEffect, useState } from 'react';

const Operations = () => {
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await fetch('http://localhost:3000/api/vehicles/')
      const json = await response.json()

      if (response.ok){
        setVehicles(json)
      }
    }
    fetchVehicles()
  }, [])

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
              <th>Owner</th>
              <th>Plate No</th>
              <th>Date</th>
              <th>insurance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {vehicles.map(vehicle => {
              return (
                <tr key={vehicle._id}>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.owner}</td>
                  <td>{vehicle.plate}</td>
                  <td>{vehicle.createdAt}</td>
                  <td>{vehicle.insurance}</td>
                  <td>
                    <div className='tbtn'>
                    <button>View</button>
                    <button>Add Quotation</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
       </div>
       </div>
    );
};

export default Operations;