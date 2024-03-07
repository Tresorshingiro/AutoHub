import React,{useState,useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { FaList, FaQuoteLeft, FaPlus , FaCheckCircle} from 'react-icons/fa';
import '../../App.css';

const QuotationNav = () => {
  const [activeButton, setActiveButton] = useState('operations');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  return (
    <div>
     <section className="header">
        <div className='lg'>
             <h1>AutoHub</h1>
           </div>
           <div className='placeholder'>
            <h3>Operations</h3>
           </div>
           <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
      </section>
      <div className="nav-links">
      <div className="user-icon">
        <img src="/user.png" alt="User Icon" />
        <h2>Operations</h2>
      </div>
      <NavLink to='/operations' activeclassname="active-link"  onClick={() => handleButtonClick('operations')}>
        <button className={`button ${activeButton === 'operations' ? 'active' : ''}`}>
          <FaQuoteLeft className={activeButton ==='operations' ? 'black-on-click' : ''}/>
            Add Quotation
        </button>
      </NavLink>
      <NavLink to='/quotationlist' activeclassname="active-link" onClick={() => handleButtonClick('quotationlist')}>
        <button className={`button ${activeButton === 'quotationlist' ? 'active' : ''}`}>
            <FaList className={activeButton === 'quotationlist' ? 'black-on-click' : ''}/>
            Quotation List
        </button>
      </NavLink>
      <NavLink to='/cleared' activeclassname="active-link" onClick={() => handleButtonClick('cleared')}>
        <button className={`button ${activeButton === 'cleared' ? 'active' : ''}`}>
        <FaCheckCircle className={activeButton ==='cleared' ? 'black-on-click' : ''}/>
            Cleared Vehicles
        </button>
      </NavLink>
      <NavLink to='/additem' activeclassname="active-link" onClick={() => handleButtonClick('additem')}>
        <button className={`button ${activeButton === 'additem' ? 'active' : ''}`}>
          <FaPlus className={activeButton === 'additem' ? 'black-on-click' : ''}/>
          Add Item
          </button>
      </NavLink>
      </div>
    </div>
  );
}

export default QuotationNav;
