import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import QuotationNav from '../components/quotationNav';
import axios from 'axios'; // Don't forget to import axios
import '../../App.css';

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
        <QuotationNav />
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
                    <Link to={`/view/${vehicle._id}`} className='vw'>
                        <button className='view'>
                          <img src='/view.png' alt='View Icon' />
                          View
                        </button>
                      </Link>
                    <Link to={`/quotation/${vehicle._id}`}className='adquota'>
                    <button>Add Quotation</button>
                    </Link>
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
