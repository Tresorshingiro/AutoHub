import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import AccountantNav from '../components/AccountantNav';
import '../../App.css'

const Income = () => {
  const [incomeData, setIncomeData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchData = async() =>{
      try{
        const response = await axios.get('http://localhost:3000/api/income/')
        setIncomeData(response.data)
      }catch(err){
        setError(err.message || 'An Error Occurred while fetching Data')
      }finally{
        setLoading(false)
      }
    }
    fetchData()
  }, [])
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

  return (
    <div className='container'>
      <AccountantNav/>
      <div className='box'>
      <div className='add'>
        <h3>Income</h3>
        <Link to='/AddIncome'>
        <button className='addbtn'> <img src='/add.png'/> </button>
        </Link>
      </div>
      {loading ? (
        <p>Loading</p>
      ): error ?(
        <p>Error: {error}</p>
      ):(
        <table>
          <thead>
            <tr>
              <th>Invoice NO</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Status</th>
              <th>Payment Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {incomeData.map(income =>(
              <tr key={income._id}>
                <td>{income.invoiceNumber}</td>
                <td>{income.createdAt}</td>
                <td>{income.customerName}</td>
                <td style={{ color: getStatusColor(income.status) }}>{income.status}</td>
                <td>{income.payment}</td>
                <td>{income.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
     </div>
    </div>
  );
};

export default Income;
