import React,{useState} from 'react';
import { NavLink } from 'react-router-dom';
import {FaCheckCircle, FaPlus, FaBuilding, FaFileInvoice, FaCaretDown, FaCaretRight,FaFileAlt, FaChevronRight, FaMoon, FaSun, FaSearch, FaBell, FaCog, FaSignOutAlt, FaTruck, FaShoppingCart, FaBox, FaHome, FaUser} from 'react-icons/fa';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const AdminNav = () => {
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false);
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuthContext()
  const { logout } = useLogout()

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };
  const toggleInventoryDropdown = () => {
    setShowInventoryDropdown(prevState => !prevState);
  };
  const toggleReportDropdown = () => {
    setShowReportDropdown(!showReportDropdown)
  };
  
  const toggleLogoutDropdown = () => {
    setShowLogoutDropdown(!showLogoutDropdown)
  };
  const handleLogout = (e) => {
    logout();
  }
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    setCollapsedSidebar(!collapsedSidebar);
  };
    return(
      <div>
      <nav className={`sidebar ${showSidebar ? '' : 'collapsed'}`}>
        <header>
          <div className='image-text'>
            <span className='image'>
              <img src='/logo.png'/>
            </span>
            <span className='name'>AutoHub</span>
          </div>
          <FaChevronRight className='toggle' onClick={toggleSidebar}/>
        </header>
        <div className='menu-bar'>
          <div className='menu'>
            <ul className='menu-links'>
              <li>
              <NavLink to='/admin' className='nav-link' activeClassName='active'>
               <FaHome className='icon'/>
                <span>Dashboard</span>
              </NavLink>
              </li>
              <li>
                <NavLink to='/employee' className='nav-link' activeClassName='active'>
                  <FaUser className='icon'/>
                  <span>Employee</span>
                </NavLink>
              </li>
              <li>
                <NavLink to='/suppliers' className='nav-link' activeClassName='active'>
                  <FaTruck className='icon'/>
                  <span>Suppliers</span>
                </NavLink>
              </li>
              <li>
                <NavLink to='/invoice' className='nav-link' activeClassName='active'>
                  <FaFileInvoice className='icon'/>
                  <span>Invoices</span>
                </NavLink>
              </li>
            </ul>
          </div>
        <div className="bottom-content">
              <li className="mode" onClick={toggleDarkMode}>
                  <div className="moon-sun">
                    <div className='icon'> 
                      <FaMoon className='moon' style={{ opacity: darkMode ? '1' : '0' }}/>
                      <FaSun className="sun" style={{ opacity: darkMode ? '0' : '1' }}/>
                      </div>
                  </div>
                  <span className="mode-text text">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                  <div className="toggle-switch">
                      <span className="switch"></span>
                  </div>
              </li>
              </div>
              </div>
      </nav>
      <div className='header-info'>
      <div className='search-box'>
        <FaSearch/>
        <input type='search' placeholder='Search...'/>
      </div>
      <div className='notification'>
        <FaBell className='icon'/>
      </div>
      <div className="user-icon" onClick={toggleLogoutDropdown}>
            {user && <div className='user-id'>{user.username}</div>}
            <img src="/user.png" alt="User Icon" />
            {showLogoutDropdown && (
              <div className="dropdown-logout">
                <ul className='sub-menu'>
                  <li>
                    <FaCog/>
                    <span>Settings</span>
                  </li>
                <li onClick={handleLogout}>
                  <FaSignOutAlt/>
                  <span>Logout</span>
                </li>
                </ul>
              </div>
            )}
          </div>
      </div>
    </div>
    );
};

export default AdminNav;