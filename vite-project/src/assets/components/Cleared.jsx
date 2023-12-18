import React from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';

const Cleared = () => {
    return(
        <div className='container'>
        <div className="nav-links">
        <Link to="/car-registration">
         <button className='button'>Car Registration</button>
        </Link>
        <Link to="/inservice">
         <button className='button'>In-service Vehicles</button>
          </Link>
        <Link to="/cleared-vehicles">
          <button className='button'>Cleared Vehicles</button>
          </Link>
      </div>
      <div className='box'></div>
      </div>  
    );
};