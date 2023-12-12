import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const Reception = () => {
  // Define vehicleInfo state using the useState hook
  const [vehicleInfo, setVehicleInfo] = useState({
    brand: '',
    type: '',
    plateNo: '',
    owner: '',
    date: '',
    engine: '',
  });

  // Define a function to handle changes in the form
  const handleChange = (e) => {
    // Update the corresponding property in vehicleInfo state
    setVehicleInfo({
      ...vehicleInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Define a function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform actions with vehicleInfo data, e.g., send it to a server
    console.log('Submitted Vehicle Info:', vehicleInfo);
  };

  return (
    <div className="reception-container">
     <section className="header">
        <div className='lg'>
          <h1>AutoHub</h1>
        </div>
      </section>
    {/* Navigation Links */}
    <div className="nav-links">
      <Link to="/reception/car-registration">
       <button className='btn'>Car Registration</button>
      </Link>
      <Link to="/reception/in-service-vehicles">
       <button className='btn'>In-service Vehicles</button>
        </Link>
      <Link to="/reception/cleared-vehicles">
        <button className='btn'>Cleared Vehicles</button>
        </Link>
    </div>
    <div className='form'>
      {/* Your form components go here */}
      <form onSubmit={handleSubmit}>
        <label>
          Brand:
          <input
            type="text"
            name="brand"
            value={vehicleInfo.brand}
            onChange={handleChange}
          />
        </label>
        <br/>
        <label>
           Brand Type:
          <input
            type="text"
            name="type"
            value={vehicleInfo.type}
            onChange={handleChange}
          />
        </label>
        <br/>
        <label>
          Plate No:
          <input
            type="text"
            name="plateNo"
            value={vehicleInfo.plateNo}
            onChange={handleChange}
          />
        </label>
        <br/>
        <label>
          Owner:
          <input
            type="text"
            name="owner"
            value={vehicleInfo.owner}
            onChange={handleChange}
          />
        </label>
        <br/>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={vehicleInfo.date}
            onChange={handleChange}
          />
        </label>
        <br/>
        <label>
          Engine:
          <input
            type="text"
            name="engine"
            value={vehicleInfo.engine}
            onChange={handleChange}
          />
        </label>
        <br/>
        <button type="submit">Submit</button>
      </form>
    </div>
</div>
  );
};

export default Reception;
