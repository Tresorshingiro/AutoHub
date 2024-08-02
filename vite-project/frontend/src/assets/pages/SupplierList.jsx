import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';
import deleteSupplier from '../components/functions/deleteSupplier';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDate from '../components/functions/formatDate';
import UpdateSupplier from '../components/UpdateSupplier';

const getLoc = "http://localhost:3000/api/suppliers/";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const toggleDropdown = (supplierId) => {
    setOpenDropdowns(prevState => ({
      ...prevState,
      [supplierId]: !prevState[supplierId]
    }));
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get(getLoc);
    //     console.log('API Response:', response.data); // Log the response
    //     if (Array.isArray(response.data)) {
    //       setSuppliers(response.data);
    //     } else {
    //       throw new Error('Response data is not an array');
    //     }
    //   } catch (err) {
    //     setError(err.message || 'An error occurred while fetching data.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const fetchData = async () => {
      try {
        const response = await axios.get(getLoc);
        console.log('API Response:', response.data); // Log the response
        setSuppliers(response.data.suppliers); // Access the suppliers array
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);

  const handleCloseView = () => {
    setViewModal(false);
  };

  return (
    <div className="container">
      <AccountantNav />
      <div className='box'>
        <div className='add'>
          <h2><span>Add</span> Supplier</h2>
          <Link to='/AddSupplier' className='addbtn'>
            <button> <FaPlus /> </button>
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
                <th>Supplier Name</th>
                <th>Tin Number</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier._id}>
                  <td>{supplier.company_name}</td>
                  <td>{supplier.TIN_no}</td>
                  <td>{supplier.telephone}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.address}</td>
                  <td>{formatDate(supplier.createdAt)}</td>
                  <td>
                    <div onClick={() => toggleDropdown(supplier._id)}>
                      <IoEllipsisVerticalOutline />
                      {openDropdowns[supplier._id] && (
                        <div className='more-icon'>
                          <ul className='min-menu'>
                            <li>
                              <FaEye />
                              <span>View</span>
                            </li>
                            <li>
                              <FaEdit />
                              <span>Edit</span>
                            </li>
                            <li className='delete' onClick={() => deleteSupplier(supplier, setSuppliers, getLoc, user)}>
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
      {viewModal && (
        <UpdateSupplier id={selectedSupplierId} onClose={handleCloseView} />
      )}
    </div>
  );
};

export default SupplierList;
  