import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import axios from 'axios';
import '../../App.css';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    owner: '',
    tel: '',
    email: '',
    brand: '',
    type: '',
    plate: '',
    engine: '',
    model: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/vehicles/${id}`);
        const data = response.data;

        setVehicle(data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

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
      const response = await axios.put(`http://localhost:3000/api/vehicles/${id}`, vehicle);
      console.log('Vehicle updated successfully:', response.data);
      // Redirect to the view page or any other page after successful update
      history.push(`/view/${id}`);
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

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
      {vehicle && (
        <div className='box'>
          <div className='pro-container'>
            <div className='details'>
              <div className='addsupplier'>
                <form onSubmit={handleSubmit}>
                  <label>
                    Owner: <input type="text" name="owner" value={vehicle.owner} onChange={handleInputChange} />
                  </label>
                  <label>
                    Tel: <input type="tel" name="tel" value={vehicle.telephone} onChange={handleInputChange} />
                  </label>
                  <label>
                    Email: <input type="email" name="email" value={vehicle.email} onChange={handleInputChange} />
                  </label>
                  <label>
                    Brand: <input type="text" name="brand" value={vehicle.brand} onChange={handleInputChange} />
                  </label>
                  <label>
                    Type: <input type="text" name="type" value={vehicle.type} onChange={handleInputChange} />
                  </label>
                  <label>
                    PlateNO: <input type="text" name="plateNo" value={vehicle.plate} onChange={handleInputChange} />
                  </label>
                  <label>
                    Engine: <input type="text" name="engine" value={vehicle.engine} onChange={handleInputChange} />
                  </label>
                  <label>
                    Model Year: <input type="text" name="model" value={vehicle.model} onChange={handleInputChange} />
                  </label>
                  <div className='buttons'>
                    <button type="submit">
                      <img src='/arrow.png' alt='Update Icon' />
                      Update
                    </button>
                    <button className='btn' onClick={() => navigate.push(`/view/${id}`)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Update;
