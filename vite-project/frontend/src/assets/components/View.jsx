import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';

const View = () => {
  const { id } = useParams();
  console.log('Received Vehicle ID:', id); 
  const [vehicle, setVehicles] = useState(undefined);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
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
   <div className="popup" id="popup">
      <div className="popup-content">
     <div className='fields'>
       {vehicle && (
                <form  method='post'>
                 <div>
                  <h3>Vehicle Details</h3>
                 </div>
                 <div className='input-field'>
                  <label>
                    Vehicle Brand: <input type="text" name="brand" value={vehicle.brand} readOnly />
                  </label>
                  </div>
                <div className='input-field'>
                 <label>
                    PlateNO: <input type="text" name="plate" value={vehicle.plate} readOnly />
                  </label>
                </div>
                  <div className='input-field'>
                  <label>
                    Type: <input type="text" name="type" value={vehicle.type} readOnly />
                  </label>
                  </div>
                  <div className='input-field'>
                    <label>
                        Insurance: <input type='text' name='insurance' value={vehicle.insurance} readOnly/>
                    </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Service Category: <input type="text" name="text" value={vehicle.service} readOnly />
                  </label>
                  </div>
                  <div>
                    <h3>Customer Details</h3>
                  </div>
                  <div className='input-field'>
                  <label>
                    Customer Name: <input type="text" name="owner" value={vehicle.owner} readOnly />
                  </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Tel: <input type="tel" name="tel" value={vehicle.telephone} readOnly />
                  </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Email: <input type="email" name="email" value={vehicle.email} readOnly />
                  </label>
                  </div>
                  <button class="close-btn" id="closeBtn">Close</button>
                </form>
      )}
      </div>
      </div>
    </div>
  );
};

export default View;
