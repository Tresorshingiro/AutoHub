import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuotationNav from '../components/quotationNav';
import axios from 'axios';
import '../../App.css';

const Quotation = () => {
  const { id } = useParams(); 
  const [vehicle, setVehicles] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('ID from URL:', id);
        const response = await axios.get(`http://localhost:3000/api/vehicles/${id}`);
        const data = response.data;
        
        console.log('ID from URL:', id);
        console.log('API response:', data);

        setVehicles(data);

      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response);
      }
    };

    fetchData();
  }, [id]);

  const [quotationInfo, setQuotationInfo] = useState({
    date: '',
    plateNo: '',
    customerName: '',
    vehicleBrand: '',
    services: [],
  });

  const [newService, setNewService] = useState({
    furniture: '',
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
      furniture: '',
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
        <QuotationNav/>
      </div>
      {vehicle && (
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
              value={vehicle.plate}
              onChange={handleQuotationChange}
              placeholder='PlateNo'
            />
          </label>
          <label>
            <input
              type="text"
              name="customerName"
              value={vehicle.owner}
              onChange={handleQuotationChange}
              placeholder='Customer Name'
            />
          </label>
          <label>
            <input
              type="text"
              name="vehicleBrand"
              value={vehicle.brand}
              onChange={handleQuotationChange}
              placeholder='Vehicle Brand'
            />
          </label>
          <label>
            <textarea
              type="text"
              name="furniture"
              value={quotationInfo.furniture}
              onChange={handleServiceChange}
              placeholder='Furniture to buy'
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
                  <th>Date</th>
                  <th>Plate No</th>
                  <th>Customer Name</th>
                  <th>Furniture to buy</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>VAT</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {quotationInfo.services.map((service, index) => (
                  <tr key={index}>
                    <td>{quotationInfo.date}</td>
                    <td>{vehicle.plate}</td>
                    <td>{vehicle.owner}</td>
                    <td>{service.furniture}</td>
                    <td>{service.quantity}</td>
                    <td>{service.unitPrice}</td>
                    <td>{service.vatIncluded ? '18%' : 'N/A'}</td>
                    <td>
                      {service.vatIncluded ? 'Included' : 'Excluded'}
                      : ${(parseFloat(service.unitPrice) * parseFloat(service.quantity)).toFixed(2)}
                    </td>
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
      )}
    </div>
  );
};

export default Quotation;
