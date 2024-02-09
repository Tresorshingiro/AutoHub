import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import QuotationNav from '../components/quotationNav';
import axios from 'axios'; // Don't forget to import axios
import '../../App.css';

const Operations = () => {
  const [receptioncars, setReceptioncars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getReceptioncars');
        setReceptioncars(response.data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <section className="header">
        <div className='lg'>
          <h1>AutoHub</h1>
        </div>
        <div className='placeholder'>
          <h3>Operations</h3>
        </div>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
      </section>
      {/* Navigation Links */}
      <div className="nav-links">
        <QuotationNav />
      </div>
      <div className='box'>
        <table>
          <thead>
            <tr>
              <th>Vehicle Brand</th>
              <th>Plate No</th>
              <th>Owner</th>
              <th>Date</th>
              <th>Engine</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {receptioncars.map(receptioncar => (
              <tr key={receptioncar._id}>
                <td>{receptioncar.brand}</td>
                <td>{receptioncar.plate}</td>
                <td>{receptioncar.owner}</td>
                <td>{new Date(receptioncar.createdAt).toLocaleDateString()}</td>
                <td>{receptioncar.engine}</td>
                <td>
                  <div className='tbtn'>
                  <Link to={`/view/${receptioncars._id}`} className='vw'>
                        <button>
                          <img src='/view.png' alt='View Icon' />
                          View
                        </button>
                      </Link>
                      <Link to='/quotation' className='quota'>
                        <button className='btn'>
                          <img src='/add.png' alt='add Icon' />
                          Add Quotation
                        </button>
                      </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Operations;
