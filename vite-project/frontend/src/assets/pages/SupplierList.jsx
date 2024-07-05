import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';
import deleteSupplier from '../components/functions/deleteSupplier';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDate from '../components/functions/formatDate';
import UpdateSupplier from '../components/UpdateSupplier';

const getLoc = "http://localhost:3000/api/supplier/";

const SupplierList = () => {
  const [supplier, setSupplier] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const { user } = useAuthContext();

  const toggleDropdown = (supplierId, event) => {
    event.stopPropagation();

    setOpenDropdowns(prevState => ({
      ...prevState,
      [supplierId]: !prevState[supplierId]
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getLoc);
        console.log('Server response:', response.data); // Log the response to check its format
        if (response.data && Array.isArray(response.data.suppliers)) { // Adjust this line based on actual response
          setSupplier(response.data.suppliers); // Adjust this line based on actual response
        } else {
          console.error('Expected an array but got:', response.data);
          setError('Data received from the server is not in the expected format.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdowns({});
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleEdit = (id) => {
    setSelectedSupplierId(id);
    setViewModal(true);
  };

  const handleCloseView = () => {
    setViewModal(false);
  };

  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSupplier = Array.isArray(supplier) ? supplier.filter(supplier =>
    (supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Filter company name
     (typeof supplier.TIN_no === 'string' && supplier.TIN_no.toLowerCase().includes(searchTerm.toLowerCase())) ||  // Filter TIN_no (if string)
     (typeof supplier.telephone === 'string' && supplier.telephone.toString().includes(searchTerm.toLowerCase())) ||  // Filter telephone (as string)
     supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Filter email
     formatDate(supplier.createdAt).toLowerCase().includes(searchTerm.toLowerCase()))   // Filter date (formatted)
    // Additional filtering conditions based on selected fields
  ) : [];

  console.log(supplier, typeof supplier.telephone);

  return (
    <div className="container">
      <AccountantNav />
      <div className='box'>
        <div className='high-table'>
          <div className='add'>
            <h2><span>Sup</span>pliers</h2>
            <Link to='/AddSupplier' className='addbtn'>
              <button> <FaPlus /> </button>
            </Link>
          </div>
          <div className='search'>
            <input
              type="text"
              placeholder='Search...'
              className='row'
              value={searchTerm}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : supplier.length === 0 ? (
          <p>No suppliers found.</p>
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
              {filteredSupplier.map(supplier => (
                <tr key={supplier._id}>
                  {/* Access properties with optional chaining */}
                  <td>{supplier.company_name}</td>
                  <td>{supplier.TIN_no}</td>
                  <td>{supplier.telephone}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.address}</td>
                  <td>{formatDate(supplier.createdAt)}</td>
                  <td>
                    <div ref={dropdownRef}>
                      <IoEllipsisVerticalOutline onClick={(event) => toggleDropdown(supplier._id, event)} />
                      {openDropdowns[supplier._id] && (
                        <div className='more-icon'>
                          <ul className='min-menu'>
                            <li onClick={() => handleEdit(supplier._id)}>
                              <FaEdit />
                              <span>Edit</span>
                            </li>
                            </ul>
                            <ul>
                            <li className='delete' onClick={() => deleteSupplier(supplier, setSupplier, getLoc, user)}>
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
        <UpdateSupplier id={selectedSupplierId} onClose={handleCloseView}/>
      )}
    </div>
  );
};

export default SupplierList;
