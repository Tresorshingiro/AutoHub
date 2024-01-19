import { useState } from "react"
import '../../App.css';

const ReceptionForm = () => {  
    // Define vehicleInfo state using the useState hook
    const [vehicleInfo, setVehicleInfo] = useState({
      owner: '',
      brand: '',
      plate: '',
      insurance: '',
      telephone: '',
      email: '',
      description:''
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
  }

  return(
    <form onSubmit={handleSubmit}>
        <label>
        <input 
        type="text" 
        name="owner" 
        placeholder='Vehicle Owner'
        className='row'
        value={vehicleInfo.owner} 
        onChange={handleChange}/>
        </label>

        <label>
        <input 
        type="text" 
        name="brand" 
        placeholder='Vehicle Brand'
        className='row'
        value={vehicleInfo.brand} 
        onChange={handleChange}/>
        </label>

        <label>
        <input 
        type="text" 
        name="plateNo" 
        placeholder='Plate No'
        className='row' 
        value={vehicleInfo.plate} 
        onChange={handleChange}/>
        </label>
    
        <label>
        <input 
        type="text" 
        name="insurance" 
        placeholder='Insurance'
        className='row' 
        value={vehicleInfo.insurance} 
        onChange={handleChange}/>
        </label>
            
        <label>
        <input 
        type="number" 
        name="tel" 
        placeholder='Telephone'
        className='row' 
        value={vehicleInfo.telephone} 
        onChange={handleChange}/>
        </label>

        <label>
        <input 
        type="text" 
        name="email" 
        placeholder='Email'
        className='row' 
        value={vehicleInfo.email} 
        onChange={handleChange}/>
        </label>

        <label>
        <input 
        type="text" 
        name="description" 
        placeholder='Description'
        className='row' 
        value={vehicleInfo.description} 
        onChange={handleChange}/>
        </label>

        <br/>
        <button type="submit" className='btn'>Save</button>
      </form>
  );
}

export default ReceptionForm;