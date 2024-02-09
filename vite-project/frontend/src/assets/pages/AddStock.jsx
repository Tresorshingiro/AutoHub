import React, {useState} from 'react';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const AddStock = () => {
  const [stockData, setStockData] = useState({
    itemName: '',
    quantity: 0,
    unitPrice: 0,
    category: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStockData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to add new stock
      const response = await axios.post('http://localhost:3000/addStock', stockData);
      console.log('Stock added successfully:', response.data);

    } catch (error) {
      console.error('Error adding stock:', error);
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
       <AccountantNav/>
      </div>
      <div className='box'>
      <h2>Add Stock</h2>
        <form className='addsupplier' onSubmit={handleSubmit}>
          <label>
            Item Name:
            <input type="text" name="itemName" value={stockData.itemName} onChange={handleInputChange} required />
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" value={stockData.quantity} onChange={handleInputChange} required />
          </label>
          <label>
            Unit Price:
            <input type="number" name="unitPrice" value={stockData.unitPrice} onChange={handleInputChange} required />
          </label>
          <label>
            Category:
            <input type="text" name="category" value={stockData.category} onChange={handleInputChange} required />
          </label>
          <button type="submit">Add Stock</button>
        </form>
      </div>
    </div>
  );
};

export default AddStock;
