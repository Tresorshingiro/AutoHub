import React, { useState, useEffect } from 'react'
import AdminNav from '../components/AdminNav'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../../App.css'
import { useAuthContext } from '../hooks/useAuthContext'
import { FaCar, FaDollarSign, FaMoneyBillAlt, FaMoneyCheckAlt, FaPeopleArrows, FaTruck, FaUserAstronaut, FaUserFriends } from 'react-icons/fa'

const Admin = () => {
  const {user} = useAuthContext();
  const [vehicleData, setVehicleData] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [customerCount, setCustomerCount] = useState(0)
  const [supplierCount, setSupplierCount] = useState(0)

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

  useEffect(() => {
    const fetchSupplierData = async() =>{
      try{
        const response = await axios.get('http://localhost:3000/api/supplier/', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setSuppliers(response.data.suppliers);
        setSupplierCount(response.data.supplierCount);
      }catch(error){
        console.error('Error fetching data:', error);
      }
    };
    fetchSupplierData()
  }, []);

  return (
    <div className='container'>
        <AdminNav/>
     <div className='dashboard'>
        <h1>Dashboard</h1>
        <div className='box-container'>
        <Link to='/vehicleAdmin'>
          <div className='small-box'>
            <div className='icon1'>
            <FaCar/>
            </div>
            <div className='text'>
            <span>Vehicles</span>
            <p>{customerCount}</p>
            </div>
          </div>
          </Link>
          <Link to='/supplierAdmin'>
          <div className='small-box'>
            <div className='icon2'>
            <FaTruck/>
            </div>
            <div className='text'>
            <span>Suppliers</span>
            <p>{supplierCount}</p>
            </div>
          </div>
          </Link>
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
