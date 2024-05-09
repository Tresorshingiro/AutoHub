import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { FaEnvelope, FaFilePdf, FaMailBulk, FaMailchimp, FaMapMarked, FaMapMarkedAlt, FaMapMarker, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';


const View = ({id, onClose}) => {
  console.log('Received Vehicle ID:', id); 
  const [vehicle, setVehicles] = useState(null);
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
    return () =>{
      setVehicles(null);
      setLoading(null);
      setError(true);
    };

  }, [id, user]); // Include 'id' as a dependency in the useEffect dependencies array

  const handleClose = () =>{
    onClose();
  };


  return (
   <div className={`popup ${vehicle ? 'show' : ''}`} id="popup">
      <div className="popup-content">
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
                <form  method='post'>
                 <div>
                  <h3>Vehicle Details</h3>
                 </div>
                 <div className='fields'>
                 <div className='input-field'>
                  <label>
                    Vehicle Brand: <input type="text" name="brand"  value={vehicle.brand} readOnly />
                  </label>
                  </div>
                <div className='input-field'>
                 <label>
                    PlateNO: <input type="text" name="plate" value={vehicle.plate_no} readOnly />
                  </label>
                </div>
                  <div className='input-field'>
                  <label>
                    Type: <input type="text" name="type" value={vehicle.type} readOnly />
                  </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Engine:
                      <input type="text" name='engine' value={vehicle.engine} readOnly/>
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                        Insurance: <input type='text' name='insurance' value={vehicle.insurance} readOnly/>
                    </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Chassis NO: <input type="text" name="text" value={vehicle.chassis_no} readOnly />
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
                      TIN NO:
                      <input type='text' name='Tin_no' value={vehicle.owner.TIN_no}/>
                    </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      Address:
                      <input type='text' name='address' value={vehicle.owner.address}/>
                    </label>
                  </div>
                  <div className='input-field'>
                  <label>
                    Email: <input type="email" name="email" value={vehicle.owner.email} readOnly />
                  </label>
                  </div>
                  <div className='input-field'>
                    <label>
                      True Client:
                      <input type='text' name='trueClient' value={vehicle.owner.true_client}/>
                    </label>
                  </div>
                </div>
                <button className="success-btn" id="closeBtn" onClick={handleClose}>Cancel</button>
                </form>
      )}
      </div>
    </div>
  );
};

export default View;
