import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaSun, FaMoon, FaCheckCircle, FaTools, FaFile, FaChevronRight, FaSearch, FaSignOutAlt, FaCog, FaBell, FaListAlt} from 'react-icons/fa';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const ReceptionNav = ({ vehicles, setFilteredVehicles }) => {
  const [activeButton, setActiveButton] = useState('registration');
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [customerFilter, setCustomerFilter] = useState('');
  const dropdownRef = useRef(null)
  const { user } = useAuthContext()
  const { logout } = useLogout()
  
  const toggleLogoutDropdown = () => {
    setShowLogoutDropdown(!showLogoutDropdown);
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogoutDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


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
            <NavLink to='/reception' className='nav-link' activeClassName='active'>
             <FaFile className='icon'/>
              <span>Car Registration</span>
            </NavLink>
            </li>
            <li>
            <NavLink to='/inservice' className='nav-link' activeClassName='active'>
              <FaTools className='icon'/>
              <span>In-Service Vehicles</span>
            </NavLink>
            </li>
            <li>
              <NavLink to='/pendingList' className='nav-link' activeClassName='active'>
              <FaListAlt className='icon'/>
              <span>Pending List</span>
              </NavLink>
            </li>
            <li>
            <NavLink to='/cleared' className='nav-link' activeClassName='active'>
              <FaCheckCircle className='icon'/>
              <span>Cleared Vehicles</span>
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
    <div className='notification'>
      <FaBell className='icon'/>
    </div>
    <div ref={dropdownRef}>
    <div className="user-icon" onClick={(event) => toggleLogoutDropdown(event)}>
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
  </div>
  );
};

export default ReceptionNav;