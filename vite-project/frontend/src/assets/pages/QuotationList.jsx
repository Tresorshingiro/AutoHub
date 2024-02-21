import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../../App.css';
import QuotationNav from '../components/quotationNav';
import axios from 'axios';
import approvedCar from '../components/functions/approvedCar';

const sendLoc = "http://localhost:3000/api/cleared/vehicles";
const getLoc = "http://localhost:3000/api/quotations/vehicles/"

const QuotationList = () => {
  const [Quotations, setQuotations] = useState([]); // Fix variable name to match the state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getLoc);
        setQuotations(response.data);
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
      <h2>Quotation List</h2>
        <div className="quotation-list">
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
                {Quotations.map(quotation => (
                  <tr key={quotation._id}>
                    <td>{quotation.createdAt}</td>
                    <td>{quotation.plate}</td>
                    <td>{quotation.owner}</td>
                    <td>{quotation.furniture}</td>
                    <td>{quotation.quantity}</td>
                    <td>{quotation.unitPrice}</td>
                    <td>{quotation.vatIncluded ? 'Yes' : 'No'}</td>
                    <td>{quotation.total}</td>
                   <td>
                      <div className='tbtn'>
                        <Link to={`/view/${quotation._id}`} className='vw'>
                          <button className='view'>
                            <img src='/view.png' alt='View Icon' />
                            View
                          </button>
                        </Link>
                          <button className='edit' onClick={() => approvedCar(quotation, setQuotations, getLoc, sendLoc)}>
                            <img src='/edit.png' alt='Edit Icon' />
                            Approval
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
