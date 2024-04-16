import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';

const PurchaseList = () => {
  const [Purchase, setPurchase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState(false);
  const [error, setError] = useState(null);

  const toggleDropdown = (purchaseId) => {
    setOpenDropdowns(prevState =>({
      ...prevState,
      [purchaseId]: !prevState[purchaseId]
  }))
  }

  const deletePurchaseById = async (id, itemName, supplier) => {
    if(window.confirm(`Are you sure you wan't to delete the ${itemName} of ${supplier}`)) {

      try {
        const response = await fetch('http://localhost:3000/api/purchase/' + id, {
          method: 'DELETE'
        })
         
        const json = await response.json()

        if (response.ok) {
          alert(`Deleted ${itemName} of ${supplier}`)
          window.location.reload()
        } else {
          // Errors occuring in the deletion process
          console.error(json.error); // log error message
          alert(`Failed to delete the Purchase due to ${json.error}`)
        }

      } catch(error) {
        // For network errors or other exceptions
        console.error('An error occured: ', error)
        alert('An error occured while deleting the Purchase')
      }
    }      
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/purchase/');
        setPurchase(response.data);
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
        <h2> <span>Add</span> Purchase</h2>
        <Link to='/AddPurchase' className='addbtn'>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Purchase.map(purchase => (
                <tr key={purchase._id}>
                  <td>{purchase.itemName}</td>
                  <td>{purchase.quantity}</td>
                  <td>{purchase.unitPrice}</td>
                  <td>{purchase.supplier}</td>
                  <td>
                    <div onClick={() => toggleDropdown(purchase._id)}>
                      <IoEllipsisVerticalOutline/>
                      {openDropdowns[purchase._id] &&(
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
                            <li onClick={() => deletePurchaseById(purchase._id, purchase.itemName, purchase.supplier)}>
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

export default PurchaseList;
