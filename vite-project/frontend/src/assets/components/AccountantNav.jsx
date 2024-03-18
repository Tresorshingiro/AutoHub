import React,{useState} from 'react';
import { NavLink } from 'react-router-dom';
import {FaCheckCircle, FaPlus, FaBuilding, FaFileInvoice, FaCaretDown, FaCaretRight,FaFileAlt } from 'react-icons/fa';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const AccountantNav = () => {
  const [activeButton, setActiveButton] = useState('cleared');
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false);
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const { user } = useAuthContext()
  const { logout } = useLogout()

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const toggleInventoryDropdown = () => {
    setShowInventoryDropdown(!showInventoryDropdown);
  };
  const toggleReportDropdown = () => {
    setShowReportDropdown(!showReportDropdown)
  };
  const handleLogout = (e) => {
    logout();
  }
    return(
      <div>
         <section className="header">
        <div className='lg'>
          <h1>AutoHub</h1>
        </div>
        <div className='placeholder'>
          <h3>Accountant</h3>
        </div>
        <div className="user-icon">
          {user && <div className='user-id'>{user.username}</div>}
          <img src="/user.png" alt="User Icon" />
          {user && <button onClick={handleLogout} className='btn' style={{backgroundColor: "red"}}>Logout</button>}
        </div>
      </section>
      <div className='nav-links'>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Accountant</h2>
        </div>
        <NavLink
        to='/accountant'
        activeclassname="active-link"
        onClick={() => handleButtonClick('cleared')}
      >
        <button className={`button ${activeButton === 'cleared' ? 'active' : ''}`}>
          <FaCheckCircle className={activeButton ==='cleared' ? 'black-on-click' : ''}/>
          Cleared Vehicles
        </button>
      </NavLink>
        <NavLink
        to='/invoice'
        activeclassname="active-link"
        onClick={() => handleButtonClick('invoice')}
        >
          <button className={`button ${activeButton === 'invoice' ? 'active' : ''}`}>
            <FaFileInvoice className={activeButton === 'invoice' ? 'black-on-click' : ''}/>
            Invoices
          </button>
        </NavLink>
        <div className="dropdown">
          <button
           className={`button ${showInventoryDropdown ? 'active' : ''}`}
           onClick={toggleInventoryDropdown}
           >
             <FaBuilding className={activeButton === 'inventory' ? 'black-on-click' : ''} />
             Inventory
            <span className="dropdown-icon-container">
            <FaCaretDown className="dropdown-icon" />
            </span>
           </button>
            {showInventoryDropdown && (
          <div className="dropdown-content">
           <NavLink to="/suppliers" className='drop-links'>Supplier</NavLink>
           <NavLink to="/purchase" className='drop-links'>Purchase</NavLink>
           <NavLink to="/stock" className='drop-links'>Stock</NavLink>
          </div>
           )}
          </div>
          <div className='dropdown'>
            <button
            className={`button ${showReportDropdown ? 'active' : ''}`}
            onClick={toggleReportDropdown}
            >
              <FaFileAlt className={activeButton === 'reports' ? 'black-on-click' : ''}/>
              Reports 
              <span className='dropdown-icon-container'>
                <FaCaretDown className='dropdown-icon'/>
              </span>
            </button>
            {showReportDropdown && (
              <div className='dropdown-content'>
                <NavLink to="/income" className='drop-links'>Incomes</NavLink>
                <NavLink to="/expense" className='drop-links'>Expenses</NavLink>
              </div>
            )}
          </div>
      </div>
      </div> 
    );
};

export default AccountantNav;