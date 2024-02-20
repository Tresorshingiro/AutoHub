import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../../App.css';
import QuotationNav from '../components/quotationNav';
import axios from 'axios';

const QuotationList = () => {
  const [Quotations, setQuotations] = useState([]); // Fix variable name to match the state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const approvedCar = async (quotation) => {
    if (window.confirm(`Are you sure you want to delete the ${quotation.brand} of ${quotation.owner}`)) {
      try {
        const deleteResponse = await fetch('http://localhost:3000/api/quotations/vehicles/' + vehicle._id, {
          method: 'DELETE'
        });
        
        const json = await deleteResponse.json();
  
        if (deleteResponse.status === 200) {
          const clearVehicle = await axios.post('http://localhost:3000/api/cleared/vehicles', {
            brand: quotation.brand,
            owner: quotation.owner,
            plate: quotation.plate,
            insurance: quotation.insurance,
            telephone: quotation.telephone,
            email: quotation.email,
            description: quotation.description,
            createdAt: quotation.createdAt
          });
  
          if (clearVehicle.status === 200) {
            alert(`Deleted ${quotation.brand} of ${quotation.owner}`);
            // Remove the vehicle from the state
            setVehicles(prevVehicles => prevVehicles.filter(v => v._id !== quotation._id));
  
          } else {
            // Errors in moving the deleted car to cleared vehicles
            alert(`Failed to move ${quotation.brand} of ${quotation.owner} to cleared vehicles`);
          }
        } else {
          // Errors occurring in the deletion process
          console.error(json.error); // Log error message
          alert(`Failed to delete the quotation due to ${json.error}`);
        }
      } catch (error) {
        // For network errors or other exceptions
        console.error('An error occurred: ', error);
        alert('An error occurred while deleting the quotation');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/quotations/vehicles/');
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
                    <td></td>
                    <td>{quotation.vatIncluded}</td>
                    <td>{quotation.total}</td>
                   <td>
                      <div className='tbtn'>
                        <Link to={`/view/${quotation._id}`} className='vw'>
                          <button className='view'>
                            <img src='/view.png' alt='View Icon' />
                            View
                          </button>
                        </Link>
                        <Link to={`/update/${quotation._id}`} className='edt'>
                          <button className='edit' onClick={() => approvedCar(quotation)}>
                            <img src='/edit.png' alt='Edit Icon' />
                            Approval
                          </button>
                        </Link>
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
