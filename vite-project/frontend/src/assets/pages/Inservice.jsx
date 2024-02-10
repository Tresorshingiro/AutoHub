import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import axios from 'axios';
import '../../App.css';

const Inservice = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteCar = async (id, brand, owner) => {
    if(window.confirm(`Are you sure you wan't to delete the ${brand} of ${owner}`)) {

      try {
        const response = await fetch('http://localhost:3000/api/vehicles/' + id, {
          method: 'DELETE'
        })
         
        const json = await response.json()

        if (response.ok) {
          alert(`Deleted ${brand} of ${owner}`)
          window.location.reload()
        } else {
          // Errors occuring in the deletion process
          console.error(json.error); // log error message
          alert(`Failed to delete the vehicle due to ${json.error}`)
        }

      } catch(error) {
        // For network errors or other exceptions
        console.error('An error occured: ', error)
        alert('An error occured while deleting the vehicle')
      }
    }      
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/vehicles/');
        setVehicles(response.data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
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
        <ReceptionNav />
      </div>
      <div className='box'>
        <h2>In-service Vehicles</h2>
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
                      <button className='delete' onClick={() => deleteCar(vehicle._id, vehicle.brand, vehicle.owner)}>
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

export default Inservice;
