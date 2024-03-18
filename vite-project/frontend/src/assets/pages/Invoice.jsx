import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'
import AccountantNav from '../components/AccountantNav';
import '../../App.css';

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async() =>{
      try{
        const response = await axios.get('http://localhost:3000/api/invoice/')
        setInvoiceData(response.data) 
      }catch(err){
        setError(err.message || 'An Error Occured While fetching data')
      } finally{
        setLoading(false)
      }
    };
    fetchData();
  }, []);
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'unpaid':
        return 'red';
      case 'partially paid':
        return 'orange';
      case 'full paid': // Removed the space here
        return 'green';
      default:
        return 'black'; // Default color if status is not recognized
    }
  }
    return(
        <div className="container">
         <AccountantNav/>
        <div className='box'>
        <div className='add'>
          <h3>Add Invoice</h3>
          <Link to='/AddInvoice'>
          <button className='addbtn'> <img src='/add.png'/> </button>
          </Link>
          </div>
        {loading ?(
          <p>Loading</p>
        ): error ? (
          <p>Error:{error}</p>
        ): (
          <table>
            <thead>
              <tr>
              <th>Invoice NO</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Status</th>
              <th>Payment Type</th>
              <th>Amount</th>
              <th>Amount Paid</th>
              <th>VAT</th>
              <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.map(invoice =>(
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.createdAt}</td>
                  <td>{invoice.owner}</td>
                  <td style={{ color: getStatusColor(invoice.status) }}>{invoice.status}</td>
                  <td>{invoice.payment}</td>
                  <td>{invoice.amount}</td>
                  <td>{invoice.amountPaid}</td>
                  <td>{invoice.vatIncluded ? 'Yes' : 'No'}</td>
                  <td>
                  <div className='tbtn'>
                      <Link to={`/view/${invoice._id}`} className='vw'>
                        <button className='view'>
                          <img src='/view.png' alt='View Icon' />
                          View
                        </button>
                      </Link>
                      <Link to={`/update/${invoice._id}`} className='edt'>
                        <button className='edit'>
                          <img src='/edit.png' alt='Edit Icon' />
                          Edit
                        </button>
                      </Link>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
        }
      </div>
    </div>
    );
};

export default Invoice;