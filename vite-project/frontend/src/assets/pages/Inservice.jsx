import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';
import {FaEye, FaEdit, FaTrash} from 'react-icons/fa'
import axios from 'axios';
import '../../App.css';
import deleteCar from '../components/functions/deleteCar';
import View from '../components/View'
import { useAuthContext } from '../hooks/useAuthContext'

const getLoc = "http://localhost:3000/api/vehicles/";

const Inservice = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthContext()

  const toggleDropdown = (vehicleId) => {
    setOpenDropdowns(prevState => ({
      ...prevState,
      [vehicleId]: !prevState[vehicleId]
    }));
  };
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
      setError(null)
    } else {
      setLoading(false)
      setError('You must be logged in');
    }

  }, [user]);

  const handleViewDetails = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    console.log('selected ID:', vehicleId); // Set the selected vehicle ID
  };

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
                  <td>{vehicle.plate_no}</td>
                  <td>{vehicle.owner ? vehicle.owner.names : 'N/A'}</td>
                  <td>{vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>{vehicle.insurance}</td>
                  <td>
                    <div onClick={() => toggleDropdown(vehicle._id)}>
                      <IoEllipsisVerticalOutline/>
                      {openDropdowns[vehicle._id] && (
                        <div className='more-icon'>
                          <ul className='min-menu'>
                            <li onClick={() => handleViewDetails(vehicle._id)}>
                              <FaEye/>
                              <span>View</span>
                            </li>
                            <Link to={`/update/${vehicle._id}`}>
                            <li>
                              <FaEdit/>
                              <span>Edit</span>
                            </li>
                            </Link>
                            <li onClick={() => deleteCar(vehicles, setVehicles, getLoc)}>
                              <FaTrash/>
                              <span>Delete</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedVehicleId && <View id={selectedVehicleId} />}
    </div>
  );
};

export default Inservice;
