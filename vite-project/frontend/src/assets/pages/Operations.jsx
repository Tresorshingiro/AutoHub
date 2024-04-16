import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import QuotationNav from '../components/quotationNav';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext'

const Operations = () => {
  const [vehicles, setVehicles] = useState([])
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

    return(
       <div className="container">
        <QuotationNav />
          <div className='box'>
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
                    {vehicles.map(vehicle => {
                        return (
                          <tr key={vehicle._id}>
                            <td>{vehicle.brand}</td>
                            <td>{vehicle.owner}</td>
                            <td>{vehicle.plate}</td>
                            <td>{vehicle.createdAt}</td>
                            <td>{vehicle.insurance}</td>
                            <td>
                              <div className='tbtn'>
                              <Link to={`/viewOperations/${vehicle._id}`} className='vw'>
                                  <button className='view'>
                                    <img src='/view.png' alt='View Icon' />
                                    View
                                  </button>
                                </Link>
                              <Link to={`/quotation/${vehicle._id}`}className='adquota'>
                              <button>Add Quotation</button>
                              </Link>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
              </table>
            )}
          </div>
    </div>
  );
};

export default Operations;
