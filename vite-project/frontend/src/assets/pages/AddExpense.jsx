import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const AddExpense = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expense = { createdAt, description, category, amount};

    try {
      const response = await axios.post('http://localhost:3000/api/expense', expense);

      setDescription('');
      setCategory('');
      setAmount('');
      setCreatedAt('');
      setSuccess('Expense Added Successfully');
      console.log('New Expense Added', response.data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response ? error.response.data : 'An unexpected error occurred');
      setSuccess(null);
    }
  };

  return (
    <div className="container">
      <AccountantNav />
      <div className="box">
        <h2>Add Expense</h2>
        <form className="addsupplier" onSubmit={handleSubmit}>
        <label>
            Date:
            <input
              type="date"
              name="date"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </label>
          <label>
            Amount:
            <input
              type="text"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <button type="submit">Add Expense</button>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
