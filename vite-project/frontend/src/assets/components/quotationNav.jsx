import React,{useState,useEffect, useRef} from 'react';
import { NavLink } from 'react-router-dom';
import { FaList, FaQuoteLeft, FaPlus , FaCheckCircle, FaChevronRight, FaMoon, FaSun, FaSearch, FaBell, FaCog, FaSignOutAlt, FaUser} from 'react-icons/fa';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
//import socketIOClient from 'socket.io-client';

//const SOCKET_SERVER_URL = "http://localhost:5000";

const QuotationNav = () => {
  const { user } = useAuthContext()
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null)
  const notificationDropdownRef = useRef(null)
  const { logout } = useLogout()


  /*useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL);

    socket.on('newVehicle', (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ]);
    });

    socket.on('vehicleCleared', (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);*/



  const toggleLogoutDropdown = () => {
    setShowLogoutDropdown(!showLogoutDropdown);
  };

  const toggleNotificationDropdown = () => {
    setShowNotification(!showNotification);
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
      if(notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowNotification(false);
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
    <div ref={notificationDropdownRef}>
    <div className='notification' onClick={(event) => toggleNotificationDropdown(event)}>
      <FaBell className='icon'/>
      {notifications.length > 0 && <span className='unread-count'>{notifications.length}</span>}
      {showNotification && (
        <div className='notification-dropdown'>
          <ul className='notification-ul'>
          {notifications.map((notification, index) => (
                  <li key={index}>
                    <div className='notify-icon'>
                      <FaUser />
                    </div>
                    <div className='notify-data'>
                      <div className='notify-title'>{notification.message}</div>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      )}
    </div>
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
}

export default QuotationNav;
