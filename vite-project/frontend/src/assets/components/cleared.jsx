import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import ReceptionNav from './receptionNav';
// import QuotationNav from './quotationNav';
// import AccountantNav from './AccountantNav';
import axios from 'axios';
import '../../App.css';
// import deleteCar from '../components/functions/deleteCar';
import { useAuthContext } from '../hooks/useAuthContext';

const getLoc = "http://localhost:3000/api/cleared/vehicles/";

const Cleared = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('cleared');
  const location = useLocation();
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

    const path = location.pathname.toLowerCase();
    if (path.includes('reception')) {
      setCurrentPage('reception');
    } else if (path.includes('operations')) {
      setCurrentPage('operations');
    } else if (path.includes('accountant')) {
      setCurrentPage('accountant');
    } else {
      setCurrentPage('cleared');
    }
  }, [location.pathname, user]);

  return (
    <div>
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
                  <div className='tbtn'>
                    <Link to={`/Approved/${vehicle._id}`} className='vw'>
                      <button className='view'>
                        <img src='/view.png' alt='View Icon' />
                        Approved
                      </button>
                    </Link>
                    <Link to='/AddInvoice' className='edt'>
                      <button className='edit'>
                        <img src='/edit.png' alt='Edit Icon' />
                        Create Invoice
                      </button>
                    </Link>
                    {/*<button className='delete' onClick={() => deleteCar(vehicle, setVehicles, getLoc)}>
                      <img src='/delete.png' alt='Delete Icon' />
                      Delete
            </button>*/}
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

export default Cleared;
