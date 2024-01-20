import React, { useState } from 'react';
import '../../App.css';

const Quotation = () => {
  const [quotationInfo, setQuotationInfo] = useState({
    date: '',
    plateNo: '',
    customerName: '',
    vehicleBrand: '',
    services: [],
  });

  const [newService, setNewService] = useState({
    description: '',
    quantity: 0,
    unitPrice: 0,
    vatIncluded: false,
  });

  const handleQuotationChange = (e) => {
    setQuotationInfo({
      ...quotationInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceChange = (e) => {
    setNewService({
      ...newService,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddService = () => {
    setQuotationInfo({
      ...quotationInfo,
      services: [...quotationInfo.services, newService],
    });

    setNewService({
      description: '',
      quantity: 0,
      unitPrice: 0,
      vatIncluded: false,
    });
  };

  const calculateTotalPrice = () => {
    return quotationInfo.services.reduce((total, service) => {
      const unitPrice = parseFloat(service.unitPrice) || 0;
      const quantity = parseFloat(service.quantity) || 0;
      const totalPrice = unitPrice * quantity;

      return total + (service.vatIncluded ? totalPrice * 1.18 : totalPrice);
    }, 0).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Quotation Info:', quotationInfo);
  };

  return (
    <div className="container">
      <section className="header">
        <div className='lg'>
          <h1>AutoHub</h1>
        </div>
        <div className='placeholder'>
          <h3>Operations</h3>
        </div>
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
        </div>
      </section>
      {/* Navigation Links */}
      <div className="nav-links">
        <div className="user-icon">
          <img src="/user.png" alt="User Icon" />
          <h2>Operations</h2>
        </div>
        <button className='button'>In-Service Vehicles</button>
        <button className='button'>Quotation List</button>
        <button className='button'>Cleared Vehicles</button>
      </div>
      <div className='box'>
      <h3>Add Quotation</h3>
        <div className='add-quotation'>
          <div className='addquota'>
          <label>
            <input
              type="date"
              name="date"
              value={quotationInfo.date}
              onChange={handleQuotationChange}
            />
          </label>
          <label>
            <input
              type="text"
              name="plateNo"
              value={quotationInfo.plateNo}
              onChange={handleQuotationChange}
              placeholder='PlateNo'
            />
          </label>
          <label>
            <input
              type="text"
              name="customerName"
              value={quotationInfo.customerName}
              onChange={handleQuotationChange}
              placeholder='Customer Name'
            />
          </label>
          <label>
            <input
              type="text"
              name="vehicleBrand"
              value={quotationInfo.vehicleBrand}
              onChange={handleQuotationChange}
              placeholder='Vehicle Brand'
            />
          </label>
          <label>
            <textarea
              type="text"
              name="description"
              value={newService.description}
              onChange={handleServiceChange}
              placeholder='Description'
            />
          </label>
          </div>
          <div className='addquota'>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={newService.quantity}
              onChange={handleServiceChange}
              placeholder='Quantity'
            />
          </label>
          <label>
            Unit Price:
            <input
              type="number"
              name="unitPrice"
              value={newService.unitPrice}
              onChange={handleServiceChange}
              placeholder='Unit Price'
            />
          </label>
          <label>
            VAT Included:
            <input
              type="checkbox"
              name="vatIncluded"
              checked={newService.vatIncluded}
              onChange={handleServiceChange}
            />
          </label>
          </div>
        </div>
        <button type="button" onClick={handleAddService}>Add Service</button>
        {/* Display added services in a table */}
        {quotationInfo.services.length > 0 && (
          <div className="added-services">
            <h3>Added Services</h3>
            <table>
              <thead>
                <tr>
                  <th>Plate No</th>
                  <th>Customer Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  <th>VAT</th>
                </tr>
              </thead>
              <tbody>
                {quotationInfo.services.map((service, index) => (
                  <tr key={index}>
                    <td>{quotationInfo.plateNo}</td>
                    <td>{quotationInfo.customerName}</td>
                    <td>{service.description}</td>
                    <td>{service.quantity}</td>
                    <td>{service.unitPrice}</td>
                    <td>
                      {service.vatIncluded ? 'Included' : 'Excluded'}
                      : ${(parseFloat(service.unitPrice) * parseFloat(service.quantity)).toFixed(2)}
                    </td>
                    <td>{service.vatIncluded ? '18%' : 'N/A'}</td>
                  </tr>
                ))}
                <tr>
                <td>
              <strong>Total Price:</strong>
               </td>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
               <td>${calculateTotalPrice()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <br />
        <div className='buttons'>
        <button type="submit" className='btn' onClick={handleSubmit}>Save</button>
        <button>Print</button>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
