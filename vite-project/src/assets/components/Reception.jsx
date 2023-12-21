import React, { useState } from 'react';
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
    Tel:'',
    email:'',
    model:'',
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
    <div className="container">
     <section className="header">
        <div className='lg'>
          <h1>AutoHub</h1>
        </div>
        <div className='placeholder'>
          <h3>Reception</h3>
        </div>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
      </section>
    {/* Navigation Links */}
    <div className="nav-links">
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Reception</h2>
        </div>
       <button className='button'>Car Registration</button>
       <button className='button'>In-service Vehicles</button>
        <button className='button'>Cleared Vehicles</button>
    </div>
    <div className='box'>
      {/* Your form components go here */}
      <form onSubmit={handleSubmit}>
        <label>
        <input type="text" name="brand" placeholder='Vehicle Brand'className='row' value={vehicleInfo.brand} onChange={handleChange}/>
        </label>
        <label>
        <input type="text" name="type" placeholder='Vehicle Type'className='row' value={vehicleInfo.type} onChange={handleChange}/>
        </label>
        <label>
        <input type="text" name="plateNo" placeholder='Plate No'className='row' value={vehicleInfo.plateNo} onChange={handleChange}/>
        </label>
        <label>
        <input type="text" name="engine" placeholder='Engine'className='row' value={vehicleInfo.engine} onChange={handleChange}/>
        </label>
        <label>
        <input type="text"name="Model" placeholder='Model Year'className='row' value={vehicleInfo.owner} onChange={handleChange}/>
        </label>
        <label>
        <input type="text"name="owner" placeholder='Owner'className='row' value={vehicleInfo.owner} onChange={handleChange}/>
        </label>
        <label>
        <input type="telephone"name="Tel" placeholder='Tel'className='row' value={vehicleInfo.owner} onChange={handleChange}/>
        </label>
        <label>
        <input type="email"name="email" placeholder='Email'className='row' value={vehicleInfo.owner} onChange={handleChange}/>
        </label>
        <label>
        <input type="date" name="date"className='row'  value={vehicleInfo.date} onChange={handleChange}/>
        </label>

        <br/>
        <button type="submit" className='btn'>Save</button>
      </form>
    </div>
 </div>
  );
};

export default Reception;
