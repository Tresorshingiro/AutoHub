import { useState } from "react"
import '../../App.css';

const ReceptionForm = () => {  
    // Define vehicleInfo state using the useState hook
    const [owner, setOwner] = useState('')
    const [brand, setBrand] = useState('')
    const [plate, setPlate] = useState('')
    const [insurance, setInsurance] = useState('')
    const [telephone, setTelephone] = useState('')
    const [email, setEmail] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null);

  // Define a function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Perform actions with vehicleInfo data, e.g., send it to a server
    const vehicle = { owner, brand, plate, insurance, telephone, email, description }

    const response = await fetch('http://localhost:3000/api/vehicles/', {
      method: 'POST',
      body: JSON.stringify({owner, brand, plate, insurance, telephone, email, description}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(!response.ok) {
      console.error('Error:', response.statusText);
      const errorData = await response.json(); // If error response contains JSON data
      console.error('Error Details:', errorData);
      setError(errorData);
    }
    if(response.ok) {
      const json = await response.json()

      setOwner('')
      setBrand('')
      setPlate('')
      setInsurance('')
      setTelephone('')
      setEmail('')
      setDescription('')
      setError(null)
      console.log('new Vehicle added', json)
    }
  }

  return(
    <form onSubmit={handleSubmit}>
        <label>
        <input 
          type="text" 
          name="owner" 
          placeholder='Vehicle Owner'
          className='row'
          onChange={(e) => setOwner(e.target.value)}
          value={owner}
        />
        </label>

        <label>
        <input 
          type="text" 
          name="brand" 
          placeholder='Vehicle Brand'
          className='row'
          onChange={(e) => setBrand(e.target.value)}
          value={brand}
        />
        </label>

        <label>
        <input 
          type="text" 
          name="plate" 
          placeholder='Plate No'
          className='row' 
          onChange={(e) => setPlate(e.target.value)}
          value={plate}
        />
        </label>
    
        <label>
        <input 
          type="text" 
          name="insurance" 
          placeholder='Insurance'
          className='row' 
          onChange={(e) => setInsurance(e.target.value)}
          value={insurance}
        />
        </label>
            
        <label>
        <input 
          type="number" 
          name="telephone" 
          placeholder='Telephone'
          className='row' 
          onChange={(e) => setTelephone(e.target.value)}
          value={telephone}
        />
        </label>

        <label>
        <input 
          type="text" 
          name="email" 
          placeholder='Email'
          className='row' 
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        </label>

        <label>
        <input 
          type="text" 
          name="description" 
          placeholder='Description'
          className='row' 
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        </label>

        <br/>
        <button>Save</button>
        {error && <div className="error">{error.error}</div>}
      </form>
  );
}

export default ReceptionForm;