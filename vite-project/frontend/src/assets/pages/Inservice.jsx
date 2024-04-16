import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReceptionNav from '../components/receptionNav';
import View from '../components/view';
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
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);
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

 {/* useEffect(() =>{
    const handleDocumentClick = (event) => {
      const isInsideDropdown = object.value(openDropdowns).some(value => value);
      if(!isInsideDropdown){
        setOpenDropdowns({});
      }
    };
    document.addEventListener('click', handleDocumentClick);

    return() => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [openDropdowns]);*/}

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

  const handleCloseView = () => {
    setViewModal(false);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.brand.toLowerCase().includes(filter.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(filter.toLowerCase()) ||
    vehicle.owner.toLowerCase().includes(filter.toLowerCase()) ||
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
      {showViewModal && (
        <View id={selectedVehicleId} onClose={handleCloseView}/>
      )}
    </div>
  );
};

export default Inservice;
