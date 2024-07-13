import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';
import deleteStock from '../components/functions/deleteStock';
import { useAuthContext } from '../hooks/useAuthContext';

const StockList = () => {
  const [Stock, setStock] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const getLoc = 'http://localhost:3000/api/stock/';

  const toggleDropdown = (stockId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [stockId]: !prevState[stockId],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getLoc, {
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

    fetchData();
  }, []);

  return (
    <div className="container">
       <AccountantNav/>
      <div className='box'>
      <div className='add'>
        <h2><span>St</span>ock</h2>
        <Link to='/AddStock'className='addbtn'>
        <button> <FaPlus/> </button>
        </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : Stock.length === 0 ? (
          <p>No stock found.</p>
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
              {Stock.map((stock) => (
                <tr key={stock._id}>
                  {/* Check if item_id exists before accessing its properties */}
                  <td>{stock.item_id ? stock.item_id.itemName : '--'}</td>
                  <td>{stock.volume_remaining}</td>
                  {/* Check if item_id exists before accessing its properties */}
                  <td>{stock.item_id ? stock.item_id.unitPrice : '--'}</td>
                  <td>{stock.supplier?.company_name || '--'}</td>
                  <td>
                    <div onClick={() => toggleDropdown(stock._id)}>
                      <IoEllipsisVerticalOutline />
                      {openDropdowns[stock._id] && (
                        <div className="more-icon">
                          <ul className="min-menu">
                            <li>
                              <FaEye />
                              <span>View</span>
                            </li>
                            <li>
                              <FaEdit />
                              <span>Edit</span>
                            </li>
                            <li
                              className="delete"
                              onClick={() =>
                                deleteStock(stock, setStock, getLoc, user)
                              }
                            >
                              <FaTrash />
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


