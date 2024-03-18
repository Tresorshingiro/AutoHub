import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import axios from 'axios';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';

const View = () => {
  const { id } = useParams(); 
  const [vehicle, setVehicles] = useState(undefined);
  const [error, setError] = useState(null)
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('ID from URL:', id);
        const response = await axios.get(`http://localhost:3000/api/vehicles/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = response.data;
        
        console.log('ID from URL:', id);
        console.log('API response:', data);

        setVehicles(data);

      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response);
      }
    };

    if (user) {
      fetchData();
      setError(null)
    } else {
      setLoading(false)
      setError('You must be logged in');
    }
  }, [id, user]); // Include 'id' as a dependency in the useEffect dependencies array

  return (
    <div className="container">
        <ReceptionNav/>
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
                    Service Category: <input type="text" name="text" value={vehicle.service} readOnly />
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
