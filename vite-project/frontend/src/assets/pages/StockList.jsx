import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const StockList = () => {
  const [Stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deletePurchaseById = async (id, itemName, supplier) => {
    if(window.confirm(`Are you sure you wan't to delete the ${itemName} of ${category}`)) {

      try {
        const response = await fetch('http://localhost:3000/api/stock/' + id, {
          method: 'DELETE'
        })
         
        const json = await response.json()

        if (response.ok) {
          alert(`Deleted ${itemName} of ${category}`)
          window.location.reload()
        } else {
          // Errors occuring in the deletion process
          console.error(json.error); // log error message
          alert(`Failed to delete the Stock due to ${json.error}`)
        }

      } catch(error) {
        // For network errors or other exceptions
        console.error('An error occured: ', error)
        alert('An error occured while deleting the stock')
      }
    }      
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stock/');
        setStock(response.data);
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
          <h3>Accountant</h3>
        </div>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
      </section>
      {/* Navigation Links */}
      <div className='nav-links'>
       <AccountantNav/>
      </div>
      <div className='box'>
      <div className='add'>
        <h3>Add Stock</h3>
        <Link to='/AddStock'>
        <button className='addbtn'> <img src='/add.png'/> </button>
        </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
        <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Supplier Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Stock.map(stock => (
                <tr key={stock._id}>
                  <td>{stock.itemName}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.unitPrice}</td>
                  <td>{stock.category}</td>
                  <td>
                    <div className='tbtn'>
                      <Link to={`/view/${stock._id}`} className='vw'>
                        <button className='view'>
                          <img src='/view.png' alt='View Icon' />
                          View
                        </button>
                      </Link>
                      <Link to={`/update/${stock._id}`} className='edt'>
                        <button className='edit'>
                          <img src='/edit.png' alt='Edit Icon' />
                          Edit
                        </button>
                      </Link>
                      <button className='delete' onClick={() => deleteStockById(purchase._id, purchase.itemName, purchase.category)}>
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
  );
};

export default StockList;
