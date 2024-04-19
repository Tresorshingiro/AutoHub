import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import '../../App.css';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] =  useAuthContext();
  const [vehicle, setVehicle] = useState({
    owner: '',
    telephone: '',
    email: '',
    brand: '',
    type: '',
    plate: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/vehicles/${id}`,{
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = response.data;

        setVehicle(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(`http://localhost:3000/api/vehicles/${id}`, vehicle);
      console.log('Vehicle updated successfully:', response.data);
      // Redirect to the view page or any other page after successful update
      navigate(`/view/${id}`);
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  return (
    <div className="container">
        <ReceptionNav />
      {vehicle && (
        <div className='box'>
              <div>
                <form onSubmit={handleSubmit}>
                  <h3>Vehicle Details</h3>
                  <div className='fields'>
                  <div className='input-field'>
                  <label>
                    Brand: <input type="text" name="brand" value={vehicle.brand} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Type: <input type="text" name="type" value={vehicle.type} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Plate NO: <input type="text" name="plate" value={vehicle.plate} onChange={handleInputChange} />
                  </label>
                  </div>
                  </div>
                  <h3>Customer Details</h3>
                  <div className='fields'>
                  <div className='input-field'>
                  <label>
                    Owner: <input type="text" name="owner" value={vehicle.owner} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Tel: <input type="tel" name="telephone" value={vehicle.telephone} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Email: <input type="email" name="email" value={vehicle.email} onChange={handleInputChange} />
                  </label>
                  </div>
                  </div>
                  <div className='buttons'>
                    <button type="submit" className='btn'>
                      <img src='/arrow.png' alt='Update Icon' />
                      Update
                    </button>
                    <button type="button" className='btn' onClick={() => navigate(`/view/${id}`)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Update;
