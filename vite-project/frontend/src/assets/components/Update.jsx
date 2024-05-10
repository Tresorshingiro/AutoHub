import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import '../../App.css';

const Update = ({id, onClose}) => {
  const {user} = useAuthContext('');


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
        const response = await axios.get(`http://localhost:3000/api/vehicles/${id}`, {
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
      const response = await axios.patch(`http://localhost:3000/api/vehicles/${id}`, vehicle, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      console.log('Vehicle updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const handleClose = () =>{
    onClose();
  };

  return (
    <div className='popup' id="popup">
    <div className='popup-content'>
    <div className='view-logo'>
          <span className='img-logo'><img  src='/logo.png'/></span>
          <span className='logo-name'>AutoHub</span>
        </div>
        <div className='address'>
          <ul>
           <li>
            <FaMapMarkerAlt/>
            <span>KN 32 ST,Kigali</span>
            </li>
           <li>
            <FaEnvelope/>
            <span>autohub@gmail.com</span>
            </li>
           <li>
            <MdPhone/>
            <span>0789736453</span>
            </li>
          </ul>
        </div>
      {vehicle && (
              <div>
                <form onSubmit={handleSubmit}>
                  <h3>Vehicle Details</h3>
                  <div className='fields'>
                  <div className='input-field'>
                  <label>
                  Vehicle Brand: <input type="text" name="brand" value={vehicle.brand} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Type: <input type="text" name="type" value={vehicle.type} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Plate NO: <input type="text" name="plate" value={vehicle.plate_no} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Engine:
                      <input type='text' name='engine' className='row' value={vehicle.engine} onChange={handleInputChange}/>
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Insurance:
                      <input type='text' name='insurance' className='row' value={vehicle.insurance} onChange={handleInputChange}/>
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      chassis No:
                      <input type='text' name='chassis_no' className='row' value={vehicle.chassis_no} onChange={handleInputChange}/>
                    </label>
                  </div>
                  </div>
                  <h3>Customer Details</h3>
                  <div className='fields'>
                  <div className='input-field'>
                  <label>
                    Owner: <input type="text" name="owner" value={vehicle.owner.names} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Tel: <input type="tel" name="telephone" value={vehicle.owner.telephone} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Tin Number:
                      <input type='number' name='TIN_no' value={vehicle.owner.TIN_no} onChange={handleInputChange}/>
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Address:
                      <input type='text' name='address' value={vehicle.owner.address} onChange={handleInputChange}/>
                    </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Email: <input type="email" name="email" value={vehicle.owner.email} onChange={handleInputChange} />
                  </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      True Client:
                      <input type='text' name='true_client' value={vehicle.owner.true_client} onChange={handleInputChange}/>
                    </label>
                  </div>
                  </div>
                  <div className='buttons'>
                    <button type='submit' className='large-btn'>
                      Update
                    </button>

                    <button type="button" className='success-btn' onClick={handleClose}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
      )}
      </div>
    </div>
  );
};

export default Update;