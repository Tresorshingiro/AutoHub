import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaFilePdf,  } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import '../../App.css';

const PrintModal = ({ onClose, vehicle, services,total_price }) => {
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
        <table className="print-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Plate No</th>
              <th>Customer Name</th>
              <th>Parts to buy</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>VAT</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service._id}>
                <td>{vehicle.createdAt}</td>
                <td>{vehicle.plate}</td>
                <td>{vehicle.owner}</td>
                <td>{service.furniture}</td>
                <td>{service.quantity}</td>
                <td>{service.unitPrice}</td>
                <td>{service.vatIncluded ? 'Yes' : 'No'}</td>
                <td></td>
              </tr>
            ))}
            <tr>
              <td><strong>Total Price:</strong></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{total_price}</td>
            </tr>
          </tbody>
        </table>
      <div className='buttons'>
      <button onClick={handlePrint}>
        <FaFilePdf/>
      </button>
      <button className='success-btn' onClick={onClose}>Cancle</button>
      </div>
      </div>
    </div>
  );
};

export default PrintModal;
