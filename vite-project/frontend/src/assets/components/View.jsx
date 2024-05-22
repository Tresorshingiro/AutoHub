import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';

const View = ({ id, onClose }) => {
  console.log('Received Vehicle ID:', id); 
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

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
        
        console.log('API response:', data);

        setVehicle(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setLoading(false);
      setError('You must be logged in');
    }

    return () => {
      setVehicle(null);
      setLoading(true);
      setError(null);
    };
  }, [id, user]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={`popup ${vehicle ? 'show' : ''}`} id="popup">
      <div className="popup-content">
        {loading ? (
          <div className='loading-msg'>
          <p>Loading...</p>
          </div>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <div className='view-logo'>
              <span className='img-logo'><img src='/logo.png' alt="Logo"/></span>
              <span className='logo-name'>AutoHub</span>
            </div>
            <div className='address-garage'>
              <ul>
                <li>
                  <FaMapMarkerAlt />
                  <span>KN 32 ST, Kigali</span>
                </li>
                <li>
                  <FaEnvelope />
                  <span>autohub@gmail.com</span>
                </li>
                <li>
                  <MdPhone />
                  <span>0789736453</span>
                </li>
              </ul>
            </div>
            {vehicle && (
              <form method='post'>
                <div>
                  <h3>Vehicle Details</h3>
                </div>
                <div className='fields'>
                  <div className='input-field'>
                    <label>
                      Vehicle Brand: <input type="text" name="brand" value={vehicle.brand} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Plate NO: <input type="text" name="plate" value={vehicle.plate_no} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Type: <input type="text" name="type" value={vehicle.type} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Engine: <input type="text" name='engine' value={vehicle.engine} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Insurance: <input type='text' name='insurance' value={vehicle.insurance} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Chassis NO: <input type="text" name="chassis_no" value={vehicle.chassis_no} readOnly />
                    </label>
                  </div>
                </div>
                <div>
                  <h3>Customer Details</h3>
                </div>
                <div className='fields'>
                  <div className='input-field'>
                    <label>
                      Customer Name: <input type="text" name="owner" value={vehicle.owner.names} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Tel: <input type="telephone" name="telephone" value={vehicle.owner.telephone} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      TIN NO: <input type='text' name='TIN_no' value={vehicle.owner.TIN_no} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Address: <input type='text' name='address' value={vehicle.owner.address} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Email: <input type="email" name="email" value={vehicle.owner.email} readOnly />
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      True Client: <input type='text' name='trueClient' value={vehicle.owner.true_client} readOnly />
                    </label>
                  </div>
                </div>
                <button className="success-btn" id="closeBtn" type="button" onClick={handleClose}>Cancel</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default View;
