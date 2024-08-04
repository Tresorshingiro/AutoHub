import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';
import deleteStock from '../components/functions/deleteStock';
import { useAuthContext } from '../hooks/useAuthContext';

const StockList = () => {
  const [Stock, setStock] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const getLoc = 'http://localhost:3000/api/stock/stocks'

  const toggleDropdown = (stockId) => {
    setOpenDropdowns(prevState =>({
      ...prevState,
      [stockId]: !prevState[stockId]
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getLoc);
        console.log(response.data);  // Log the received data
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
          <h2><span>Add</span>Stock</h2>
          <Link to='/AddStock'className='addbtn'>
            <button> <FaPlus/> </button>
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
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Stock.map(stock => (
                <tr key={stock._id}>
                  <td>{stock.item_id?.itemName || 'N/A'}</td>
                  <td>{stock.volume_remaining || 'N/A'}</td>
                  <td>{stock.item_id?.unitPrice || 'N/A'}</td>
                  <td>
                    {stock.item_id.supplier.length > 0 ? (
                      stock.item_id.supplier.map(supplier => supplier.company_name).join(', ')
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{stock.total_value}</td>
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
                            <li className='delete' onClick={() => deleteStock(stock, setStock, getLoc, user)}>
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
