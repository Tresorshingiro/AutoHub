import React,{useState,useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { FaList, FaQuoteLeft, FaPlus , FaCheckCircle, FaChevronRight, FaMoon, FaSun, FaSearch, FaBell, FaCog, FaSignOutAlt} from 'react-icons/fa';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const QuotationNav = () => {
  const { user } = useAuthContext()
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useLogout()

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const toggleLogoutDropdown = () => {
    setShowLogoutDropdown(!showLogoutDropdown);
  };

  const handleLogout = (e) => {
    logout();
    location.href = '/'
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    setCollapsedSidebar(!collapsedSidebar);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  return (
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
            <NavLink to='/operations' className='nav-link' activeClassName='active'>
             <FaQuoteLeft className='icon'/>
              <span>Add Quotation</span>
            </NavLink>
            </li>
            <li>
            <NavLink to='/quotationlist' className='nav-link' activeClassName='active'>
              <FaList className='icon'/>
              <span>Quotation List</span>
            </NavLink>
            </li>
            <li>
            <NavLink to='/cleared' className='nav-link' activeClassName='active'>
              <FaCheckCircle className='icon'/>
              <span>Cleared Vehicles</span>
            </NavLink>
            </li>
            <li>
            <NavLink to='/additem' className='nav-link' activeClassName='active'>
              <FaPlus className='icon'/>
              <span>Add Item</span>
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
}

export default QuotationNav;
