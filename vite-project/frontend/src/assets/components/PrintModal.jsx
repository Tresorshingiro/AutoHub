import React from 'react';
import '../../App.css';

const PrintModal = ({ onClose, vehicle, services,total_price }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-modal">
      <div id='print-content'>
      <div className='print-header'>
        <h1>AutoHub</h1>
      </div>
      <div className='print-list'>
      <ul>
        <ol>autohub@gmail.com</ol>
        <ol>0788888888</ol>
        <ol>Kigali-Rwanda</ol>
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
      </div>
      <div className='buttons'>
      <button onClick={handlePrint}>Print</button>
      <button className='delete' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PrintModal;
