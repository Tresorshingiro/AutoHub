import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuotationNav from '../components/quotationNav';
import ReceptionNav from '../components/receptionNav';

import axios from 'axios';
import '../../App.css';

const Cleared = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteCar = async (vehicle) => {
    if (window.confirm(`Are you sure you want to delete the ${vehicle.brand} of ${vehicle.owner}`)) {
      try {
        const deleteResponse = await fetch('http://localhost:3000/api/cleared/vehicles/' + vehicle._id, {
          method: 'DELETE'
        });
        
        const json = await deleteResponse.json();
        
        if (deleteResponse.status === 200) {
          alert(`Deleted ${vehicle.brand} of ${vehicle.owner}`);
          // Remove the vehicle from the state
          setVehicles(prevVehicles => prevVehicles.filter(v => v._id !== vehicle._id));
        } else {
          // Errors occurring in the deletion process
          console.error(json.error); // Log error message
          alert(`Failed to delete the vehicle due to ${json.error}`);
        }
      } catch (error) {
        // For network errors or other exceptions
        console.error('An error occurred: ', error);
        alert('An error occurred while deleting the vehicle');
      }
    }
  } ;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cleared/vehicles/');
        setVehicles(response.data);
      } catch (err) {
          setError(err.message || 'An error occurred while fetching data.');
      } finally {
      setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <QuotationNav/>
      </div>
      <div className='box'>
        <h2>Cleared Vehicles</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vehicle Brand</th>
                <th>Plate No</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Insurance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle._id}>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.plate}</td>
                  <td>{vehicle.owner}</td>
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
                      <Link to={`/update/${vehicle._id}`} className='edt'>
                        <button className='edit'>
                          <img src='/edit.png' alt='Edit Icon' />
                          Edit
                        </button>
                      </Link>
                      <button className='delete' onClick={() => deleteCar(vehicle)}>
                        <img src='/delete.png' alt='Delete Icon' />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>  
    );
};

export default Cleared;