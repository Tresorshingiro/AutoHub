import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaFilePdf, FaUser,  } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import '../../App.css';

const PrintModal = ({ onClose, vehicle, services, total_price }) => {
  const handlePrint = () => {
    window.print();
  };

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
            {services.map((service, index) => (
              <tr key={index}>
                <td>{vehicle.createdAt}</td>
                <td>{vehicle.plate_no}</td>
                <td>{service.description}</td>
                <td>{service.furniture}</td>
                <td>{service.quantity}</td>
                <td>{service.unitPrice}</td>
                <td>{service.vatIncluded ? 'Yes' : 'No'}</td>
                <td>{parseFloat(service.unitPrice) * parseFloat(service.quantity)}</td>
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
      <button className='success-btn' onClick={onClose}>Cancle</button>
      </div>
    </div>
  );
};

export default PrintModal;
