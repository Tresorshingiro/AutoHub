import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const AddInvoices = () => {
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    invoiceNumber: '',
    invoiceDate: '',
    status: '',
    paymentType: '',
    amount: '',
    amountPaid: '',
    vat: false,
    discount: '',
    // ... other fields
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    const inputValue = type === 'checkbox' ? checked : value;

    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/addInvoice', invoiceData);
      console.log('Invoice added successfully:', response.data);

    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  };

  return (
    <div className="container">
      <section className="header">
        <div className='lg'>
          <h1>AutoHub</h1>
        </div>
        <div className='placeholder'>
          <h3>Accountant</h3>
        </div>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
      </section>
      {/* Navigation Links */}
      <div className='nav-links'>
        <AccountantNav />
      </div>
      <div className='box'>
        <h2>Add Invoice</h2>
        <form className='addsupplier' onSubmit={handleSubmit}>
          <label>
            Customer Name:
            <input type="text" name="customerName" value={invoiceData.customerName} onChange={handleInputChange} required />
          </label>
          <label>
            Invoice Number:
            <input type="text" name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleInputChange} required />
          </label>
          <label>
            Invoice Date:
            <input type="date" name="invoiceDate" value={invoiceData.invoiceDate} onChange={handleInputChange} required />
          </label>
          <label>
            Status:
            <select name="status" value={invoiceData.status} onChange={handleInputChange} required>
              <option value="">Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Half Paid">Half Paid</option>
              <option value="Full Paid">Full Paid</option>
            </select>
          </label>
          <label>
            Payment Type:
            <select name="paymentType" value={invoiceData.paymentType} onChange={handleInputChange} required>
              <option value="">Select Payment Type</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Bank">Bank</option>
              <option value="Cheque">Cheque</option>
              {/* Add more options as needed */}
            </select>
          </label>
          <label>
            Amount:
            <input type="text" name="amount" value={invoiceData.amount} onChange={handleInputChange} required />
          </label>
          <label>
            Amount Paid:
            <input type="text" name="amountPaid" value={invoiceData.amountPaid} onChange={handleInputChange} required />
          </label>
          <label>
            VAT (18%):
            <input type="checkbox" name="vat" checked={invoiceData.vat} onChange={handleInputChange} />
          </label>
          <label>
            Discount:
            <input type="text" name="discount" value={invoiceData.discount} onChange={handleInputChange} required />
          </label>
          <button type="submit">Add Invoice</button>
        </form>
      </div>
    </div>
  );
};

export default AddInvoices;
