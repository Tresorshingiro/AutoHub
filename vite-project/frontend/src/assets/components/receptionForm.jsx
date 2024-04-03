import { useState } from "react"
import '../../App.css';
import { useAuthContext } from "../hooks/useAuthContext"

const ReceptionForm = () => {  
    // Define vehicleInfo state using the useState hook
    const [owner, setOwner] = useState('')
    const [brand, setBrand] = useState('')
    const [type, setType] = useState('')
    const [plate, setPlate] = useState('')
    const [insurance, setInsurance] = useState('')
    const [telephone, setTelephone] = useState('')
    const [email, setEmail] = useState('')
    const [service, setService] = useState('');
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null);
    const {user} = useAuthContext()

  // Define a function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      setError('You must be logged in');
      return;
    }
  
    const vehicle = { owner, brand, type, plate, insurance, telephone, email, service };
  
    try {
      const response = await fetch('http://localhost:3000/api/vehicles/', {
        method: 'POST',
        body: JSON.stringify(vehicle),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred while processing your request.');
        setSuccess(null);
      } else {
        const json = await response.json();
        setOwner('');
        setBrand('');
        setType('');
        setPlate('');
        setInsurance('');
        setTelephone('');
        setEmail('');
        setService('');
        setError(null);
        setSuccess('Vehicle added successfully');
        console.log('New vehicle added', json);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setError('An unexpected error occurred. Please try again later.');
      setSuccess(null);
    }
  };
  

  return(
    <form  onSubmit={handleSubmit}>
      <div>
        <div>
        <h3>Vehicle Details</h3>
        </div>
        <div className="fields">
        <div className="input-field">
        <label>
          Vehicle Brand:
        <input 
          type="text" 
          name="brand" 
          placeholder='Vehicle Brand'
          className='row'
          onChange={(e) => setBrand(e.target.value)}
          value={brand}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          Type:
        <input 
          type="text" 
          name="type" 
          placeholder='Vehicle Type'
          className='row'
          onChange={(e) => setType(e.target.value)}
          value={type}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          Plate NO:
        <input 
          type="text" 
          name="plate" 
          placeholder='Plate No'
          className='row' 
          onChange={(e) => setPlate(e.target.value)}
          value={plate}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          Insurance:
        <input 
          type="text" 
          name="insurance" 
          placeholder='Insurance'
          className='row' 
          onChange={(e) => setInsurance(e.target.value)}
          value={insurance}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          Chassi NO:
        <input 
          type="text" 
          name="insurance" 
          placeholder='Chassi NO'
          className='row' 
          onChange={(e) => setInsurance(e.target.value)}
          value={insurance}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          Service Category:
        <select name="service" value={service} onChange={(e) => setService(e.target.value)}>
          <option value="">Select Service</option>
          <option value="Service A">Service A</option>
          <option value="Service B">Service B</option>
          <option value="Service C">Service C</option>
        </select>
        </label>
        </div>
      </div>
        <h3>Customer Details</h3>
      <div className="fields">
       <div className="input-field">   
      <label>
          Customer Name:
        <input 
          type="text" 
          name="owner" 
          placeholder='Customer Name'
          className='row'
          onChange={(e) => setOwner(e.target.value)}
          value={owner}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          Telephone:
        <input 
          type="number" 
          name="telephone" 
          placeholder='Telephone'
          className='row' 
          onChange={(e) => setTelephone(e.target.value)}
          value={telephone}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          TIN Number:
        <input 
          type="number" 
          name="Tin Number" 
          placeholder='Tin Number'
          className='row' 
          onChange={(e) => setTelephone(e.target.value)}
          value={telephone}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          Email:
        <input 
          type="text" 
          name="email" 
          placeholder='Email'
          className='row' 
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        </label>
        </div>
      </div>
        <br/>
        <button className="large-btn">Save</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        </div>
      </form>
  );
}

export default ReceptionForm;