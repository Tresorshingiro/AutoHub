import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'
import { FaFileInvoice, FaEdit, FaPlus } from 'react-icons/fa';
import AccountantNav from '../components/AccountantNav';
import '../../App.css';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDropdowns, setOpenDropdowns] = useState(false);
  const [error, setError] = useState(null)

  const toggleDropdown = (invoiceId) => {
    setOpenDropdowns(prevState =>({
      ...prevState,
      [invoiceId]: !prevState[invoiceId]
    })
  )};

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
          <h2><span>Add</span>Invoice</h2>
          <Link to='/AddInvoice' className='addbtn'>
           <button> <FaPlus/> </button>
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
                  <div onClick={() => toggleDropdown(invoice._id)}>
                    <IoEllipsisVerticalOutline/>
                    {openDropdowns[invoice._id] &&(
                      <div className='more-icon'>
                        <ul className='min-menu'>
                          <li>
                            <FaFileInvoice/>
                            <span>Invoice</span>
                          </li>
                          <li>
                            <FaEdit/>
                            <span>Edit</span>
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
        )
        }
      </div>
    </div>
    );
};

export default Invoice;