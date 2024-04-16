import React from 'react'
import AdminNav from '../components/AdminNav'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'

const Employee = () => {
  return (
    <div className='container'>
        <AdminNav/>
      <div className='box'>
        <div className='add'>
            <h2><span>Add</span> Employee</h2>
            <Link to='/addEmployee' className='addbtn'>
                <button> <FaPlus/> </button>
            </Link>
        </div>
      </div>
    </div>
  )
}

export default Employee
