import React from 'react'
import AdminNav from '../components/AdminNav'
import PaymentStatistics from '../components/paymentStatistics'
import PaidServices from '../components/paidServices'
import '../../App.css'
import { useAuthContext } from '../hooks/useAuthContext'

const Admin = () => {
  const {user} = useAuthContext();
  return (
    <div className='container'>
        <AdminNav/>
        <h2>Dashboard</h2>
        <div className='dashboard-content'>
        <div>
        <PaymentStatistics />
        </div>
        <div>
        <PaidServices/>
        </div>
      </div>
    </div>
  )
}

export default Admin;
