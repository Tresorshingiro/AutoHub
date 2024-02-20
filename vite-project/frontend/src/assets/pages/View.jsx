import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import axios from 'axios';
import '../../App.css';

const View = () => {
  const { id } = useParams(); 
  const [vehicle, setVehicles] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('ID from URL:', id);
        const response = await axios.get(`http://localhost:3000/api/vehicles/${id}`);
        const data = response.data;
        
        console.log('ID from URL:', id);
        console.log('API response:', data);

        setVehicles(data);

      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response);
      }
    };

    fetchData();
  }, [id]); // Include 'id' as a dependency in the useEffect dependencies array

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
        <ReceptionNav/>
      </div>
      {/* Conditionally render based on whether vehicle is defined */}
      {vehicle && (
        <div className='box'>
          <div className='pro-container'>
            <div className='details'>
              <div className='addsupplier'>
                <form  method='post'>
                 <label>
                    PlateNO: <input type="text" name="plate" value={vehicle.plate} readOnly />
                  </label>
                  <label>
                    Brand: <input type="text" name="brand" value={vehicle.brand} readOnly />
                  </label>
                  <label>
                    Type: <input type="text" name="type" value={vehicle.type} readOnly />
                  </label>
                  <label>
                    Owner: <input type="text" name="owner" value={vehicle.owner} readOnly />
                  </label>
                  <label>
                    Tel: <input type="tel" name="tel" value={vehicle.telephone} readOnly />
                  </label>
                  <label>
                    Email: <input type="email" name="email" value={vehicle.email} readOnly />
                  </label>
                  <label>
                    Description: <input type="text" name="text" value={vehicle.description} readOnly />
                  </label>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View;
