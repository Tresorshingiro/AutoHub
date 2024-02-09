import React, {useState} from 'react';
import '../../App.css';
import AccountantNav from '../components/AccountantNav';

const AddPurchase = () => {
  const [purchaseData, setPurchaseData] = useState({
    itemName: '',
    quantity: 0,
    unitPrice: 0,
    supplier: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to add a new purchase
      const response = await axios.post('http://localhost:3000/AddPurchase', purchaseData);
      console.log('Purchase added successfully:', response.data);

    } catch (error) {
      console.error('Error adding purchase:', error);
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
      <h2>Add Purchase</h2>
        <form className='addsupplier' onSubmit={handleSubmit}>
          <label>
            Item Name:
            <input type="text" name="itemName" value={purchaseData.itemName} onChange={handleInputChange} required />
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" value={purchaseData.quantity} onChange={handleInputChange} required />
          </label>
          <label>
            Unit Price:
            <input type="number" name="unitPrice" value={purchaseData.unitPrice} onChange={handleInputChange} required />
          </label>
          <label>
            Supplier:
            <input type="text" name="supplier" value={purchaseData.supplier} onChange={handleInputChange} required />
          </label>
          <button type="submit">Add Purchase</button>
        </form>
      </div>
    </div>
  );
};

export default AddPurchase;
