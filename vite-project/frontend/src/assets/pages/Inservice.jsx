import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import axios from 'axios';
import '../../App.css';
import deleteCar from '../components/functions/deleteCar';
import { useAuthContext } from '../hooks/useAuthContext'

const getLoc = "http://localhost:3000/api/vehicles/";

const Inservice = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await axios.get(getLoc, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setVehicles(response.data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }

  }, [user]);

  return (
    <div className="container">
        <ReceptionNav />
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
                      <button className='delete' onClick={() => deleteCar(vehicle, setVehicles, getLoc, user)}>
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
