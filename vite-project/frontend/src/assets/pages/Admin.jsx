import React, { useState, useEffect } from 'react'
import AdminNav from '../components/AdminNav'
import axios from 'axios'
import '../../App.css'
import { useAuthContext } from '../hooks/useAuthContext'
import { FaDollarSign, FaMoneyBillAlt, FaMoneyCheckAlt, FaPeopleArrows, FaTruck, FaUserAstronaut, FaUserFriends } from 'react-icons/fa'

const Admin = () => {
  const {user} = useAuthContext();
  const [vehicleData, setVehicleData] = useState([])
  const [customerCount, setCustomerCount] = useState(0)

  useEffect(() => {
    const fetchData = async() =>{
      try{
        const response = await axios.get('http://localhost:3000/api/vehicles/', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setVehicleData(response.data.vehicleData);
        setCustomerCount(response.data.customerCount);
      }catch(error){
        console.error('Error fetching data:', error);
      }
    };
    fetchData()
  }, []);
  return (
    <div className='container'>
        <AdminNav/>
     <div className='dashboard'>
        <h1>Dashboard</h1>
        <div className='box-container'>
          <div className='small-box'>
            <div className='icon1'>
            <FaUserFriends/>
            </div>
            <div className='text'>
            <span>Customers</span>
            <p>{customerCount}</p>
            </div>
          </div>
          <div className='small-box'>
            <div className='icon2'>
            <FaTruck/>
            </div>
            <span>Suppliers</span>
          </div>
          <div className='small-box'>
            <div className='icon3'>
            <FaDollarSign/>
           </div>
            <span>Incomes</span>
          </div>
          <div className='small-box'>
            <div className='icon4'>
            <FaMoneyCheckAlt/>
            </div>
            <span>Expenses</span>
          </div>
        </div>
      </div> 
    </div>
  )
}

export default Admin;
