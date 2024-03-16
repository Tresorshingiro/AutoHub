import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AccountantNav from '../components/AccountantNav';

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/expense/');
        setExpenseData(response.data);
      } catch (err) {
        setError(err.message || 'An Error Occurred While Fetching Data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='container'>
      <AccountantNav />
      <div className='box'>
        <div className='add'>
          <h3>Expense</h3>
          <Link to='/AddExpense'>
            <button className='addbtn'> <img src='/add.png' alt="Add" /> </button>
          </Link>
        </div>
        {loading ? (
          <p>Loading</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.map(expense => (
                <tr key={expense._id}>
                  <td>{expense.createdAt}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>{expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Expense;
