import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';

const SupplierList = () => {
  const [supplier, setSupplier] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleDropdown = (supplierId) =>{
    setOpenDropdowns(prevState =>({
      ...prevState,
      [supplierId] : !prevState[supplierId]
    }))
  }

  const deleteSupplierById = async (id, name, contactPerson) => {
    if(window.confirm(`Are you sure you wan't to delete the ${name} of ${contactPerson}`)) {

      try {
        const response = await fetch('http://localhost:3000/api/suppliers/' + id, {
          method: 'DELETE'
        })
         
        const json = await response.json()

        if (response.ok) {
          alert(`Deleted ${name} of ${contactPerson}`)
          window.location.reload()
        } else {
          // Errors occuring in the deletion process
          console.error(json.error); // log error message
          alert(`Failed to delete the Supplier due to ${json.error}`)
        }

      } catch(error) {
        // For network errors or other exceptions
        console.error('An error occured: ', error)
        alert('An error occured while deleting the Supplier')
      }
    }      
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/suppliers/');
        setSupplier(response.data);
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
        <h2><span>Add</span>Supplier</h2>
        <Link to='/AddSupplier' className='addbtn'>
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
                <th>Supplier Name</th>
                <th>Tin Number</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {supplier.map(supplier => (
                <tr key={supplier._id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.tin}</td>
                  <td>{supplier.contactPerson}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.email}</td>
                  <td>
                    <div onClick={() => toggleDropdown(supplier._id)}>
                      <IoEllipsisVerticalOutline/>
                      {openDropdowns[supplier._id] &&(
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

export default SupplierList;
