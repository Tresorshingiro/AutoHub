import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const AddInvoices = () => {
  const [owner, setOwner] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [status, setStatus] = useState('')
  const [payment, setPayment] = useState('')
  const [amount, setAmount] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [vatIncluded , setVatIncluded] = useState(false)
  const [discount, setDiscount] = useState('')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async(e) =>{
    e.preventDefault()

    const invoice = {owner, invoiceNumber, createdAt, status, payment, amount, amountPaid, vatIncluded, discount}

    try {
      const response = await axios.post('http://localhost:3000/api/invoice/', invoice);

      setOwner('');
      setInvoiceNumber('');
      setCreatedAt('');
      setStatus('');
      setPayment('');
      setAmount('');
      setAmountPaid('');
      setVatIncluded(false); 
      setDiscount('');
      setSuccess('Invoice Added Successfully');
      console.log('New Invoice Added', response.data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response ? error.response.data : 'An unexpected error occurred');
      setSuccess(null);
    }
  };
  return (
    <div className="container">
        <AccountantNav />
      <div className='box'>
        <h2> <span>Add</span>  Invoice</h2>
        <form  onSubmit={handleSubmit}>
          <h3>Customer Details</h3>
          <div className='fields'>
          <div className='input-field'>
          <label>
            Customer Name:
            <input type="text" name="customerName" placeholder='Customer Name' className='row' value={owner} onChange={(e) => setOwner(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
            <label>
              TIN Number:
              <input type="text" name="tinNumber" placeholder='TIN Number' className='row'/>
            </label>
          </div>
          <div className='input-field'>
            <label>
              Tel:
              <input type='text' name='telephone' placeholder='Tel' className='row'/>
            </label>
          </div>
          </div>
          <h3>Invoice Details</h3>
          <div className='fields'>
          <div className='input-field'>
          <label>
            Invoice NO:
            <input type="text" name="invoiceNumber" placeholder='Invoice NO' className='row' value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Invoice Date:
            <input type="date" name="invoiceDate" className='row' value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Status:
            <select name="status" className='row' value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="unPaid">UnPaid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Full Paid">Full Paid</option>
            </select>
          </label>
          </div>
          <div className='input-field'>
          <label>
            Payment Type:
            <select name="paymentType" className='row' value={payment} onChange={(e) => setPayment(e.target.value)} required>
              <option value="">Select Payment Type</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Bank">Bank</option>
              <option value="Cheque">Cheque</option>
              {/* Add more options as needed */}
            </select>
          </label>
          </div>
          <div className='input-field'>
          <label>
            Amount:
            <input type="text" name="amount" className='row' placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Amount Paid:
            <input type="text" name="amountPaid" className='row' placeholder='Amount Paid' value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} required />
          </label>
          </div>
          <div className='input-field'>
          <label>
            Discount:
            <input type="text" name="discount" className='row' placeholder='Discount' value={discount} onChange={(e) => setDiscount(e.target.value)} required />
          </label>
          </div>
          <div>
          <label>
            VAT (18%):
            <input type="checkbox" name="vat" className='row' checked={vatIncluded} onChange={(e) => setVatIncluded(e.target.checked)} />
          </label>
          </div>
          </div>
          <button className='large-btn'>Add Invoice</button>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddInvoices;
