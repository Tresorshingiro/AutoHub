import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';
import { useAuthContext } from '../hooks/useAuthContext';

const StockList = () => {
  const [Stock, setStock] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuthContext();

  const toggleDropdown = (stockId) => {
    setOpenDropdowns(prevState =>({
      ...prevState,
      [stockId]: !prevState[stockId]
    }))
  }

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
        const response = await axios.get('http://localhost:3000/api/stock/', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setStock(response.data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    if( user ) {
      fetchData();
      setError(null);
    } else {
      setLoading(false);
      setError('You must be logged in')
    }
  }, [user]);
  return (
    <div className="container">
       <AccountantNav/>
      <div className='box'>
      <div className='add'>
        <h2><span>Add</span> Stock</h2>
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
                <th>Measurement Unit</th>
                <th>Unit Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Stock.map(stock => (
                <tr key={stock._id}>
                  <td>{stock.itemName}</td>
                  <td>{stock.volume_remaining}</td>
                  <td>{stock.measurement_unit}</td>
                  <td>{stock.unitPrice}</td>
                  <td>
                    <div onClick={() => toggleDropdown(stock._id)}>
                      <IoEllipsisVerticalOutline/>
                      {openDropdowns[stock._id] &&(
                        <div className='more-icon'>
                          <ul className='min-menu'>
                            <li>
                              <FaEye/>
                              <span>View</span>
                            </li>
                            <li>
                              <FaEdit/>
                              <span>Edit</span>
                            </li>
                            <li>
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
    </div>
  );
};

export default StockList;
