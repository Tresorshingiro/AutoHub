import React from 'react'
import AdminNav from '../components/AdminNav'
import '../../App.css'

const AddEmployee = () => {
  return (
    <div className='container'>
        <AdminNav/>
      <div className='box'>
        <h2><span>Add</span> Employee</h2>
        <form>
            <div className='fields'>
                <div className='input-field'>
                    <label>
                        Employee Name:
                        <input type='text' name='name' className='row' placeholder='Employee Name'/>
                    </label>
                </div>    
                <div className='input-field'>
                    <label>
                        Email:
                        <input type='email' name='email' className='row' placeholder='Email'/>
                    </label>
                </div>
                <div className='input-field'>
                    <label>
                        Tel:
                        <input type='tel' name='tel' className='row' placeholder='Tel'/>
                    </label>
                </div>
                <div className='input-field'>
                    <label>
                        ID:
                        <input type='ID' name='ID' className='row' placeholder='ID'/>
                    </label>
                </div>
                <div className='input-field'>
                    <label>
                        Address:
                        <input type='address' name='address' className='row' placeholder='Address'/>
                    </label>
                </div>
                <div className='input-field'>
                    <label>
                        Role:
                        <select name='role' className='row'>
                            <option value=''>Select Role</option>
                            <option value='reception'>Reception</option>
                            <option value='operation'>Operationist</option>
                            <option value='accountant'>Accountant</option>
                            <option value='admin'>Admin</option>
                        </select>
                    </label>
                </div>
                <div className='input-field'>
                    <label>
                        Password:
                        <input type='password' name='password' className='row' placeholder='Password'/>
                    </label>
                </div>
            </div>
            <button className='large-btn'>Add Employee</button>
        </form>
      </div>
    </div>
  )
}

export default AddEmployee
