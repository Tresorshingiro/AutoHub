import React, { useState, useEffect } from 'react';
import '../../App.css';
import QuotationNav from '../components/quotationNav';
import axios from 'axios';

const QuotationList = () => {
  const [Quotations, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/quotations/vehicle/');
        setVehicles(response.data);
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
      <QuotationNav/>
    </div>
    <div className='box'>
    <div className="quotation-list">
      <h2>Quotation List</h2>
      {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
      <table>
        <thead>
          <tr>
          <th>Date</th>
          <th>Plate No</th>
          <th>Customer Name</th>
          <th>Furniture to buy</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>VAT</th>
          <th>Total Price</th>
          <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {Quotations.map(quotations => (
                <tr key={quotations._id}>
                  <td>{quotations.createdAt}</td>
                  <td>{quotations.plate}</td>
                  <td>{quotations.owner}</td>
                  <td>{quotations.quantity}</td>
                  <td>{quotations.unitPrice}</td>
                  <td>{quotations.vatIncluded}</td>
                  <td>
                    <div className='tbtn'>
                      <Link to={`/view/${vehicle._id}`} className='vw'>
                        <button className='view'>
                          <img src='/view.png' alt='View Icon' />
                          View
                        </button>
                      </Link>
                      <Link to={`/update/${vehicle._id}`} className='edt'>
                        <button className='edit'>
                          <img src='/edit.png' alt='Edit Icon' />
                          Edit
                        </button>
                      </Link>
                      <button className='delete' onClick={() => deleteCar(vehicle)}>
                        <img src='/delete.png' alt='Delete Icon' />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
        )}
    </div>
    </div>
    </div>
 );
};

export default QuotationList;