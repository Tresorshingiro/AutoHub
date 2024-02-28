import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const PurchaseList = () => {
  const [Purchase, setPurchase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <h3>Add Purchase</h3>
        <Link to='/AddPurchase'>
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
              {Purchase.map(purchase => (
                <tr key={purchase._id}>
                  <td>{purchase.itemName}</td>
                  <td>{purchase.quantity}</td>
                  <td>{purchase.unitPrice}</td>
                  <td>{purchase.supplier}</td>
                  <td>
                    <div className='tbtn'>
                      <Link to={`/view/${purchase._id}`} className='vw'>
                        <button className='view'>
                          <img src='/view.png' alt='View Icon' />
                          View
                        </button>
                      </Link>
                      <Link to={`/update/${purchase._id}`} className='edt'>
                        <button className='edit'>
                          <img src='/edit.png' alt='Edit Icon' />
                          Edit
                        </button>
                      </Link>
                      <button className='delete' onClick={() => deletePurchaseById(purchase._id, purchase.itemName, purchase.supplier)}>
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

export default PurchaseList;
