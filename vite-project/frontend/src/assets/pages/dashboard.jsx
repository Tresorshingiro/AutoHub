import React from 'react'
import AdminNav from './Admin'
import PaymentStatistics from '../components/paymentStatistics'
import PaidServices from '../components/paidServices'
import '../../App.css'

const dashboard = () => {
  return (
    <div className='container'>
        <AdminNav/>
      <div className="dashboard-content">
        <h2 className="dashboard-title">Dashboard</h2>
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

export default dashboard
