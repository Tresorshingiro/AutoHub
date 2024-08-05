import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuotationNav from '../components/quotationNav';
import axios from 'axios';
import PrintModal from '../components/PrintModal';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { FaFilePdf } from 'react-icons/fa';

const Quotation = () => {
  const { id } = useParams(); 
  const [vehicle, setVehicles] = useState(undefined);
  const [stockItem, setStockItem] = useState([]);  
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/vehicles/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = response.data;
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response);
      }
    };

    if (user) {
      fetchData();
      setError(null);
    } else {
      setError('You must be logged in');
    }

  }, [user, id]);

  useEffect(() => {
    const fetchStock = async () => {
      try{
        const response = await axios.get(`http://localhost:3000/api/stock/`, {
          headers:{
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = response.data;
        console.log('API response', data);
        setStockItem(data);
      } catch (error) {
        console.error('Error in Fetching data:', error);
        console.error('Error details:', error.response);
      }
    };

    if (user) {
      fetchStock();
      setError(null);
    } else{
      setError('You must be logged in')
    }
  }, [user]);

  const [quotationInfo, setQuotationInfo] = useState({
    date: '',
    plateNo: '',
    customerName: '',
    vehicleBrand: '',
    services: []
  });

  const [newService, setNewService] = useState({
    furniture: '',
    description: '',
    quantity: '',
    unitPrice: '',
    service:'',
    vatIncluded: false,
    total_price: true,
  });

  const handleQuotationChange = (e) => {
    setQuotationInfo({
      ...quotationInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceChange = (e) => {
    const {name, value, type, checked} = e.target;
    setNewService({
      ...newService,
      [name]: type === 'checked' ? checked : value,
    });
  };

  const calculateTotalPrice = (updatedServices) => {
    return updatedServices.reduce((total, service) => {
      const unitPrice = parseFloat(service.unitPrice) || 0;
      const quantity = parseFloat(service.quantity) || 0;
      const totalPrice = unitPrice * quantity;
      return total + (service.vatIncluded ? totalPrice * 1.18 : totalPrice);
    }, 0).toFixed(2);
  };

  const handleSubmit = async () => {
    try {
      const totalPrice = calculateTotalPrice([...quotationInfo.services, newService]);

      const quotationResponse = await axios.post('http://localhost:3000/api/quotations/vehicles/', {
        worker_id: vehicle.worker_id,
        car_id: vehicle.owner._id,
        unitPrice: newService.unitPrice,
        vatIncluded: newService.vatIncluded,
        description: newService.description,
        category: newService.service,
        stock_item: newService.furniture,
        quantity: newService.quantity,
        total_price: totalPrice
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (quotationResponse.status === 200) {
        setSuccess('Service added successfully');
        setError(null);
        setShowTable(true);
        setQuotationInfo(prevState => ({
          ...prevState,
          services: [...prevState.services, newService]
        }));
        setNewService({
          furniture: '',
          description: '',
          quantity: '',
          unitPrice: '',
          service:'',
          vatIncluded: false,
          total_price: true,
        });
      } else {
        setError('An error occurred while saving service');
        setSuccess(null);
      }
    } catch (error) {
      console.error('An error occurred while saving service:', error);
      setError('An error occurred while saving service');
      setSuccess(null);
    }
  };

  const handleAddService = async () => {
    await handleSubmit();
  };

  const handleClosePrintModal = () => {
    setShowPrintModal(false);
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  return (
    <div className="container">
      <QuotationNav />
      {vehicle && (
        <div className='box'>
          <h2><span>Add</span> Quotation</h2>
          <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <h3>Vehicle Details</h3>
              <div className='fields'>
                <div className='input-field'>
                  <label>
                    Date:
                    <input
                      type="text"
                      name="date"
                      className='row'
                      value={vehicle.createdAt}
                      onChange={handleQuotationChange}
                    />
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    Vehicle Brand:
                    <input
                      type="text"
                      name="vehicleBrand"
                      className='row'
                      value={vehicle.brand}
                      onChange={handleQuotationChange}
                      placeholder='Vehicle Brand'
                    />
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    PlateNo:
                    <input
                      type="text"
                      name="plateNo"
                      className='row'
                      value={vehicle.plate_no}
                      onChange={handleQuotationChange}
                      placeholder='PlateNo'
                    />
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    Type:
                    <input
                      type='text'
                      name='type'
                      className='row'
                      value={vehicle.type}
                      onChange={handleQuotationChange}
                    />
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    Engine:
                    <input
                      type='text'
                      name='engine'
                      className='row'
                      value={vehicle.engine}
                      onChange={handleQuotationChange}
                    />
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    Customer Name:
                    <input
                      type="text"
                      name="customerName"
                      className='row'
                      value={vehicle.owner.names}
                      onChange={handleQuotationChange}
                      placeholder='Customer Name'
                    />
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    TIN Number:
                    <input
                      type='number'
                      name='TIN_no'
                      className='row'
                      value={vehicle.owner.TIN_no}
                      onChange={handleQuotationChange}
                    />
                  </label>
                </div>
              </div>
              <h3>Service Details</h3>
              <div className='fields'>
                <div className='input-field'>
                  <label>
                    Description:
                    <textarea
                      text="text"
                      name="description"
                      className='row'
                      value={newService.description}
                      onChange={handleServiceChange}
                      placeholder='Description'
                    />
                  </label>
                </div>
                <div className="input-field">
                  <label>
                    Service Category:
                    <select name="service" className='row' value={newService.service} onChange={handleServiceChange}>
                      <option value="">Select Service</option>
                      <option value="Service A">Service A</option>
                      <option value="Service B">Service B</option>
                      <option value="Service C">Service C</option>
                    </select>
                  </label>
                </div>
                <div className='input-field'>
                <label>
                  Parts to Buy:
                <select
                      name="furniture"
                      className='row'
                      value={newService.furniture}
                      onChange={handleServiceChange}
                    >
                      <option value="">Select Part</option>
                      {stockItem.map((item) => (
                        <option key={item._id} value={item._id}>{item.item_id.itemName}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    Quantity:
                    <input
                      type="number"
                      name="quantity"
                      className='row'
                      value={newService.quantity}
                      onChange={handleServiceChange}
                    />
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    Unit Price:
                    <input
                      type="number"
                      name="unitPrice"
                      className='row'
                      value={newService.unitPrice}
                      onChange={handleServiceChange}
                    />
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    VAT Included:
                    <input
                      type="checkbox"
                      name="vatIncluded"
                      className='checkbox'
                      checked={newService.vatIncluded}
                      onChange={() => setNewService({ ...newService, vatIncluded: !newService.vatIncluded })}
                    />
                  </label>
                </div>
              </div>
            </form>
          </div>
          <button onClick={handleAddService} className='large-btn'>Add Service</button>
          {/* Display added services in a table */}
          {showTable && quotationInfo.services.length > 0 && (
            <div className="added-services">
              <h3>Added Services</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Plate No</th>
                    <th>Description</th>
                    <th>Parts to buy</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>VAT</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {quotationInfo.services.map((service, index) => (
                    <tr key={index}>
                      <td>{vehicle.createdAt}</td>
                      <td>{vehicle.plate_no}</td>
                      <td>{service.description}</td>
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
                    <td colSpan="7">
                      <strong>Total Price:</strong>
                    </td>
                    <td>${calculateTotalPrice(quotationInfo.services)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <br />
          <div>
            <button className='success-btn' onClick={handlePrint}>Save</button>
            {error && <div className='error'>{error}</div>}
            {success && <div className='success'>{success}</div>}
          </div>

          {/* Display the print modal when showPrintModal is true */}
          {showPrintModal && (
            <PrintModal onClose={handleClosePrintModal} vehicle={vehicle} services={quotationInfo.services} total_price={calculateTotalPrice(quotationInfo.services)} />
          )}
        </div>
      )}
    </div>
  );
};

export default Quotation;
