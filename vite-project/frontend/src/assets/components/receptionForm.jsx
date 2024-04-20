import { useState } from "react"
import '../../App.css';
import { useAuthContext } from "../hooks/useAuthContext"

const ReceptionForm = () => {  
    // Define vehicleInfo state using the useState hook
    const [names, setNames] = useState('')
    const [brand, setBrand] = useState('')
    const [type, setType] = useState('')
    const [plate_no, setPlateNo] = useState('')
    const [chassis_no, setChassisNo] = useState('')
    const [engine, setEngine] = useState('')
    const [insurance, setInsurance] = useState('')
    const [telephone, setTelephone] = useState('')
    const [email, setEmail] = useState('')
    const [TIN_no, setTIN_no] = useState('')
    const [true_client, setTrueClient] = useState('')
    const [address, setAddress] = useState('')
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
  
    const vehicle = { names, TIN_no, true_client, address, brand, type, plate_no,chassis_no, engine, insurance, telephone, email };
  
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
        setNames('');
        setBrand('');
        setType('');
        setPlateNo('');
        setChassisNo('');
        setEngine('');
        setInsurance('');
        setTelephone('');
        setEmail('');
        setService('');
        setTIN_no('');
        setTrueClient('');
        setAddress('');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'owner'&& e.target.checked) {
        setTrueClient(value);
    } else if (name === 'isTrueClient' && !e.target.checked) {
        setTrueClient('');
    }
    // Update other state variables based on input field name
    switch (name) {
        case 'brand':
            setBrand(value);
            break;
        case 'type':
            setType(value);
            break;
        case 'plateNo':
            setPlateNo(value);
            break;
        case 'engine':
            setEngine(value);
            break;
        case 'insurance':
            setInsurance(value);
            break;
        case 'chassisNo':
            setChassisNo(value);
            break;
        case 'owner':
           setNames(value);
           break;
        case 'telephone':
            setTelephone(value);
            break;
        case 'TIN_no':
            setTIN_no(value);
            break;
        case 'email':
            setEmail(value);
            break;
        case 'address':
            setAddress(value);
            break;
        case 'trueClient':
            setTrueClient(value);
            break;
        default:
          break;
    }
  };
  
  const isTrueClient = (e) => {
    const trueClientInput = document.getElementsByName("trueClient")[0];
    const namesInput = document.getElementsByName("owner")[0];

    if (e.target.checked) {
        setTrueClient(namesInput.value);
        trueClientInput.setAttribute("readonly", true);
    } else {
        setTrueClient('');
        trueClientInput.removeAttribute("readonly");
    }
}  

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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
          value={type}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          Plate NO:
        <input 
          type="text" 
          name="plateNo" 
          placeholder='Plate No'
          className='row' 
          onChange={handleInputChange}
          value={plate_no}
        />
        </label>
        </div>
        <div className="input-field">
          <label>
            Engine:
            <input
            type="text"
            name="engine"
            placeholder="Engine"
            className="row"
            onChange={handleInputChange}
            value={engine}
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
          onChange={handleInputChange}
          value={insurance}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          Chassis NO:
        <input 
          type="text" 
          name="chassisNo" 
          placeholder='Chassis NO'
          className='row' 
          onChange={handleInputChange}
          value={chassis_no}
        /> 
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
          onChange={handleInputChange}
          value={names}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          True Client?:
        <input
              type="checkbox"
              name="isTrueClient"
              className="checkbox"
              onChange={isTrueClient}
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
          onChange={handleInputChange}
          value={telephone}
        />
        </label>
        </div>
        <div className="input-field">
        <label>
          TIN Number:
        <input 
          type="number" 
          name="TIN_no" 
          placeholder='Tin Number'
          className='row' 
          onChange={handleInputChange}
          value={TIN_no}
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
          onChange={handleInputChange}
          value={email}
        />
        </label>
        </div>
        <div className="input-field">
          <label>
            Address:
            <input
            type="text"
            name="address"
            placeholder="Address"
            className="row"
            onChange={handleInputChange}
            value={address}
            />
          </label>
        </div>
        <div className="input-field">
          <label>
            True Client:
            <input
            type="text"
            name="trueClient"
            placeholder="True Client"
            className="row"
            onChange={handleInputChange}
            value={true_client}
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