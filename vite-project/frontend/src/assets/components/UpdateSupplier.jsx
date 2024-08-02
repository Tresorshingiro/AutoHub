import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { useAuthContext } from '../hooks/useAuthContext'
import '../../App.css';
import { FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import { MdPhone } from 'react-icons/md'

const UpdateSupplier = ({id, onClose}) => {
    const {user} = useAuthContext('');
    const [supplier, setSupplier] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/suppliers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = response.data;

                setSupplier(data);
            } catch (error) {
                console.error('Error Fetching data:', error);
            }
        };

        fetchData();
    }, [id, user]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSupplier((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`http://localhost:3000/api/suppliers/${id}`, supplier, {
                headers: {
                    'Authorization': `Beare ${user.token}`
                }
            });
            console.log('Supplier updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
    };

    const handleClose = () => {
        onClose();
    };

  return (
    <div className='popup' id='popup'>
        <div className='popup-content'>
            <div className='view-logo'>
                <span className='img-logo'><img src='/logo.png'/></span>
                <span className='logo-name'>Autohub</span>
            </div>
            <div className='address'>
                <ul>
                    <li>
                        <FaMapMarkerAlt/>
                        <span>KN 32 ST, Kigali</span>
                    </li>
                    <li>
                     <FaEnvelope/>
                     <span>autohub@gmail.com</span>
                    </li>
                    <li>
                        <MdPhone/>
                        <span>0789736453</span>
                    </li>
                </ul>
            </div>
            {supplier && (
                <div>
                    <form onSubmit={handleSubmit}>
                        <h2>Supplier</h2>
                        <div className='fields'>
                            <div className='input-field'>
                                <label>
                                    Supplier Name:
                                    <input type='text'name='company_name' className='row' value={supplier.company_name} onChange={handleInputChange}/>
                                </label>
                            </div>
                            <div className='input-field'>
                                <label>
                                    Tin No:
                                    <input type='number'name='TIN_no' className='row' value={supplier.TIN_no} onChange={handleInputChange}/>
                                </label>
                            </div>
                            <div className='input-field'>
                                <label>
                                    Email:
                                    <input type='email'name='email' className='row' value={supplier.email} onChange={handleInputChange}/>
                               </label>
                            </div>
                            <div className='input-field'>
                                <label>
                                    Tel:
                                    <input type='tel'name='telephone' className='row' value={supplier.telephone} onChange={handleInputChange}/>
                                </label>
                            </div>
                            <div className='input-field'>
                                <label>
                                    Address:
                                    <input type='text'name='address' className='row' value={supplier.address} onChange={handleInputChange}/>
                                </label>
                            </div>
                        </div>
                        <div className='buttons'>
                            <button type='submit' className='large-btn'>Update</button>
                            <button type='button' className='success-btn' onClick={handleClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
      
    </div>
  );
};

export default UpdateSupplier;
