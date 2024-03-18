import React,{useState,useEffect} from 'react'
import axios from 'axios'
import AccountantNav from '../components/AccountantNav'
import '../../App.css'

const AddIncome = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [status, setStatus] =useState('')
    const [payment, setPayment] = useState('')
    const [amount, setAmount] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    
    const handleSubmit = async(e) =>{
        e.preventDefault()

        const income = {invoiceNumber, createdAt, customerName, status, payment, amount, success, error}

        try{
            const response = await axios.post('http://localhost:3000/api/income/', income)

            setInvoiceNumber('');
            setCreatedAt('');
            setCustomerName('');
            setStatus('');
            setPayment('');
            setAmount('');
            setSuccess('');
            setError('Income Added Successfully');
            console.log('Income Added', response.data); 
        }catch(error){
            console.error('Error', error)
            setError(error.response ? error.response.data: 'An unexpected Error Occurred')
            setSuccess(null)
        }
    }

  return (
    <div className='container'>
        <AccountantNav/>
      <div className='box'>
        <h2>Add Income</h2>
        <form className='addsupplier' onSubmit={handleSubmit}>
            <label>
                Invoice Number:
                <input type='text' value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required/>
            </label>
            <label>
                Date:
                <input name='date' type='date' value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} required/>
            </label>
            <label>
                Customer Name:
                <input name='customername'type='text' value={customerName} onChange={(e) => setCustomerName(e.target.value)} required/>
            </label>
            <label>
                Status:
                <select name='select' value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="">Select Status</option>
                    <option value="Full Paid"> Full Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="unPaid">Unpaid</option>
                </select>
            </label>
            <label>
                Payment Type:
                <select name='select' value={payment} onChange={(e) => setPayment(e.target.value)} required>
                    <option value="">Select Payment</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="Mobile Money">MoMo</option>
                    <option value="Cheque">Cheque</option>
                </select>
            </label>
            <label>
                Amount:
                <input type='number'name='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} required/>
            </label>
            <button type='submit'>Save</button>
            {error && <div className="error">{error.error}</div>}
            {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  )
}

export default AddIncome
