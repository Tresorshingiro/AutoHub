import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import View from '../components/View';
import Update from '../components/Update';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';
import { FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import '../../App.css';
import deleteCar from '../components/functions/deleteCar';
import { useAuthContext } from '../hooks/useAuthContext';

const getLoc = "http://localhost:3000/api/vehicles/";

const Inservice = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [showViewModal, setViewModal] = useState(false);
  const [showUpdateModal, setUpdateModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getLoc, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setVehicles(response.data);
        setOpenDropdowns({}); // Initialize openDropdowns state for each vehicle
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
      setError(null);
    } else {
      setLoading(false);
      setError('You must be logged in');
    }
  }, [user]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Clicked outside the dropdown, so close all dropdowns
        setOpenDropdowns({});
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  const toggleDropdown = (vehicleId) => {
    setOpenDropdowns(prevState => ({
      ...prevState,
      [vehicleId]: !prevState[vehicleId]
    }));
  };

  const handleViewDetails = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setViewModal(true);
  };

  const handleEdit = (id) => {
    setSelectedVehicleId(id);
    setUpdateModal(true);
  };

  const handleCloseView = () => {
    setViewModal(false);
    setUpdateModal(false);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.brand.toLowerCase().includes(filter.toLowerCase()) ||
    vehicle.plate_no.toLowerCase().includes(filter.toLowerCase()) ||
    vehicle.owner.names.toLowerCase().includes(filter.toLowerCase()) ||
    vehicle.insurance.toLowerCase().includes(filter.toLowerCase()) ||
    vehicle.createdAt.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      <ReceptionNav vehicles={vehicles} />
      <div className='box'>
        <div className='high-table'>
        <h2><span>In-</span>service Vehicles</h2>
        <div className='search'>
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={handleFilterChange}
        />
        </div>
        </div>
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
              {filteredVehicles.map(vehicle => (
                <tr key={vehicle._id}>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.plate_no}</td>
                  <td>{vehicle.owner ? vehicle.owner.names : 'N/A'}</td>
                  <td>{vehicle.createdAt}</td>
                  <td>{vehicle.insurance}</td>
                  <td>
                    <div ref={dropdownRef}>
                      <IoEllipsisVerticalOutline onClick={() => toggleDropdown(vehicle._id)}/>
                      {openDropdowns[vehicle._id] && (
                        <div className='more-icon'>
                          <ul className='min-menu'>
                            <li onClick={() => handleViewDetails(vehicle._id)}>
                              <FaEye/>
                              <span>View</span>
                            </li>
                              <li onClick={() => handleEdit(vehicle._id)}>
                                <FaEdit/>
                                <span>Edit</span>
                              </li>
                          </ul>
                          <ul>
                          <li className='delete' onClick={() => deleteCar(vehicle, setVehicles, getLoc, user)}>
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
      {showViewModal && (
        <View id={selectedVehicleId} onClose={handleCloseView}/>
      )}
      {showUpdateModal && (
        <Update id={selectedVehicleId} onClose={handleCloseView}/>
      )}
    </div>
  );
};

export default Inservice;
