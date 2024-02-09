import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import axios from 'axios';
import '../../App.css';

const View = () => {
  const {id} = useParams(); 
  const [receptioncars, setReceptioncars] = useState({
    owner: '',
    telephone: '',
    email: '',
    brand: '',
    plate: '',
    engine:'',
    model:'',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('ID from URL:', id);
        const response = await axios.get(`http://localhost:3000/getReceptioncars/${id}`);
        const data = response.data;
        
        console.log('ID from URL:', id);
        console.log('API response:', data);

        setReceptioncars({
          owner: data.owner,
          telephone: data.telephone,
          email: data.email,
          brand: data.brand,
          plate: data.plate,
          engine: data.engine,
          model: data.model,
        });

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
      <div className='box'>
        <div className='pro-container'>
          <div className='details'>
            <h4>Customer Details</h4>
            <div className='pro'>
              <form method='post'>
                <label>
                  Owner: <input type="text" name="owner" value={receptioncars.owner} readOnly />
                </label>
                <label>
                  Tel: <input type="tel" name="tel" value={receptioncars.telephone} readOnly />
                </label>
                <label>
                  Email: <input type="email" name="email" value={receptioncars.email} readOnly />
                </label>
              </form>
            </div>
          </div>
          <div className='details'>
            <h4>Vehicle Details</h4>
            <div className='pro'>
              <form method='post'>
                <label>
                  Brand: <input type="text" name="brand" value={receptioncars.brand} readOnly />
                </label>
                <label>
                  PlateNO: <input type="text" name="plate" value={receptioncars.plate} readOnly />
                </label>
                <label>
                  Engine: <input type="text" name="engine" value={receptioncars.engine} readOnly />
                </label>
                <label>
                  Model Year: <input type="text" name="model" value={receptioncars.model} readOnly />
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
