import React from 'react';
import {NavLink} from 'react-router-dom';
import '../../App.css';

const ReceptionNav = () => {
    return(
        <div>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
            <h2>Reception</h2>
        </div>
        <NavLink to='/reception' activeclassname="active-link">
        <button className='button'>
          <img src='/registration.png'/>
          Car Registration
          </button>
        </NavLink>
        <NavLink to='/inservice' activeclassname="active-link">
          <button className='button'>
            <img src='/clipboard.png'/>
            In-service Vehicles
            </button>
        </NavLink>
        {/*<NavLink to='/cleared' activeclassname="active-link">
          <button className='button'>
            <img src='/mark.png'/>
            Cleared Vehicles
          </button>
    </NavLink>*/}
        </div> 
    );
};


export default ReceptionNav;