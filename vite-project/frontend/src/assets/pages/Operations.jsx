import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import QuotationNav from '../components/quotationNav';
import View from '../components/view';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext'
import { FaEye, FaPlus } from 'react-icons/fa';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';

const Operations = () => {
  const [vehicles, setVehicles] = useState([])
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [showViewModal, setViewModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await fetch('http://localhost:3000/api/vehicles/', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json()

      if (response.ok){
        setVehicles(json)
      }
    }

    if (user) {
      fetchVehicles();
      setError(null)
      setLoading(false)
    } else {
      setLoading(false)
      setError('You must be logged in');
    }

  }, [user])

  const toggleDropdown = (vehicleId) => {
    setOpenDropdowns(prevState => ({
      ...prevState,
      [vehicleId]: !prevState[vehicleId]
    }));
  };

  const handleViewDetails = (vehicleId) => {
    setSelectedVehicleId(vehicleId)
    setViewModal(true);
  };

  const handleCloseView = () =>{
    setViewModal(false);
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

    return(
       <div className="container">
        <QuotationNav />
          <div className='box'>
            <div className='high-table'>
            <h2><span>In</span>-Repair Service</h2>
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
                        <th>Owner</th>
                        <th>Plate No</th>
                        <th>Date</th>
                        <th>insurance</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {filteredVehicles.map(vehicle => {
                        return (
                          <tr key={vehicle._id}>
                            <td>{vehicle.brand}</td>
                            <td>{vehicle.owner.names}</td>
                            <td>{vehicle.plate_no}</td>
                            <td>{vehicle.createdAt}</td>
                            <td>{vehicle.insurance}</td>
                            <td>
                              <div>
                              <IoEllipsisVerticalOutline onClick={() => toggleDropdown(vehicle._id)}/>
                              {openDropdowns[vehicle._id] &&(
                              <div className='more-icon'>
                                <ul className='min-menu'>
                                  <li onClick={() => handleViewDetails(vehicle._id)}>
                                    <FaEye/>
                                    <span>View</span>
                                  </li>
                                  
                                  <Link to={`/quotation/${vehicle._id}`}>
                                    <li>
                                    <FaPlus/>
                                    <span>Quotation</span>
                                    </li>
                                  </Link>
                                </ul>
                              </div>
                              )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
              </table>
            )}
          </div>
          {showViewModal&&(
            <View id={selectedVehicleId} onClose={handleCloseView}/>
          )}
    </div>
  );
};

export default Operations;
