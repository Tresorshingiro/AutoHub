import React, {useEffect, useState} from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaFilePdf, FaUser,  } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import { useAuthContext } from '../hooks/useAuthContext';
import '../../App.css';

const ViewQuotation = ({id, onClose}) => {
  const [Quotations, setQuotation] = useState(null);
  const [error, setError] = useState(null);
  const {user} = useAuthContext();
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`hhtp://localhost:3000/api/quotations/vehicles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            console.log('ID from URL:', id);
            setQuotation(response.data);
        }catch(err) {
            setError(err.messaage || 'An error occurred while fetching data')
        }
    }

    if(user) {
        fetchData();
        setError(null);
    } else {
        setError('You Must be Logged in')
    }

  }, [id, user]);

  const handleClose = () => {
    onClose();
  }

  return (
    <div className="popup">
      <div className="popup-content" id='print-content'>
      <div className='view-logo'>
          <span className='img-logo'><img  src='/logo.png'/></span>
          <span className='logo-name'>AutoHub</span>
        </div>
      <div className='address'>
          <div className='address-garage'>
          <ul>
           <li>
            <FaMapMarkerAlt/>
            <span>KN 32 ST,Kigali, PO Box 1447</span>
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
        <div className='address-user'>
        <ul>
          <li>
          <FaUser/>
          <span>{vehicle.owner.names}</span>
          </li>
          <li>
            <FaEnvelope/>
            <span>{vehicle.owner.email}</span>
          </li>
          <li>
            <MdPhone/>
            <span>{vehicle.owner.telephone}</span>
          </li>
          <li>
            <FaMapMarkerAlt/>
            <span>{vehicle.owner.address}</span>
          </li>
        </ul>
        </div>
      </div>
        <table className="print-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Plate No</th>
              <th>Description</th>
              <th>Parts to buy</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>VAT</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {Quotations.map((quotation) => (
              <tr key={quotation._id}>
                <td>{quotation.createdAt}</td>
                <td>{quotation.car_id?.plate_no}</td>
                <td>{quotation.repair_service_id?.description}</td>
                <td>{quotation.repair_service_id?.stock_item}</td>
                <td>{quotation.repair_service_id?.quantity}</td>
                <td>{quotation.repair_service_id?.unitPrice}</td>
                <td>{service.vatIncluded ? 'Yes' : 'No'}</td>
                <td>{parseFloat(quotation.service_id?.unitPrice) * parseFloat(quotation.repair_service_id.quantity)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="7"><strong>Total Price:</strong></td>
              <td>{total_price}</td>
            </tr>
          </tbody>
        </table>
        </div>
      <div className='buttons'>
      <button className='primary-btn' onClick={handlePrint}>
        <FaFilePdf/>
      </button>
      <button className='success-btn' onClick={handleClose}>Cancle</button>
      </div>
    </div>
  );
};

export default ViewQuotation;
