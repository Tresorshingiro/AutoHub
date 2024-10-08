import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';
// import ReceptionNav from './receptionNav';
// import QuotationNav from './quotationNav';
// import AccountantNav from './AccountantNav';
import axios from 'axios';
import '../../App.css';
// import deleteCar from '../components/functions/deleteCar';
import { useAuthContext } from '../hooks/useAuthContext';

const getLoc = "http://localhost:3000/api/cleared/vehicles/";

const ClearedAccountant = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState(false);
  const location = useLocation();
  const { user } = useAuthContext();

  const toggleDropdown = (vehicleId) =>{
    setOpenDropdowns(prevState => ({
      ...prevState,
      [vehicleId]: !prevState[vehicleId]
    }));
  }

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

  }, [ user]);

  return (
      <div className='box'>
      <h2>Cleared Vehicles</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Vehicle Brand</th>
              <th>Plate No</th>
              <th>Customer Name</th>
              <th>VAT</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle._id}>
                <td>{vehicle.createdAt}</td>
                <td>{vehicle.brand}</td>
                <td>{vehicle.plate}</td>
                <td>{vehicle.owner}</td>
                <td>{vehicle.vatInclude ? 'Yes' : 'No'}</td>
                <td>{vehicle.total_price}</td>
                <td>
                <div onClick={() => toggleDropdown(vehicle._id)}>
                      <IoEllipsisVerticalOutline/>
                      {openDropdowns[vehicle._id] && (
                        <div className='more-icon'>
                          <ul className='min-menu'>
                            <Link to={`/approved/${vehicle._id}`}>
                            <li>
                              <FaCheckCircle/>
                              <span>Approved</span>
                            </li>
                            </Link>
                            <Link to='/invoice'>
                            <li>
                              <FaEdit/>
                              <span>Invoice</span>
                            </li>
                            </Link>
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
  );
};

export default ClearedAccountant;
