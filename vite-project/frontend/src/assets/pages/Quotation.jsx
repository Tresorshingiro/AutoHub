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
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [service, setService] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const { user } = useAuthContext();
  const [stockItems, setStockItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vehicle data
        const vehicleResponse = await axios.get(`http://localhost:3000/api/vehicles/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const vehicleData = vehicleResponse.data;
        setVehicles(vehicleData);

        // Fetch stock items
        const stockResponse = await axios.get('http://localhost:3000/api/stock/', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setStockItems(stockResponse.data);
        console.log('Data:', stockResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred while fetching data.');
      }
    };

    if (user) {
      fetchData();
      setError(null);
    } else {
      setError('You must be logged in');
    }
  }, [user, id]);

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
    setNewService({
      ...newService,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotalPrice = (services) => {
    return services.reduce((total, service) => {
      const unitPrice = parseFloat(service.unitPrice) || 0;
      const quantity = parseFloat(service.quantity) || 0;
      const totalPrice = unitPrice * quantity;
      return total + (service.vatIncluded ? totalPrice * 1.18 : totalPrice);
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const totalPrice = calculateTotalPrice(quotationInfo.services);
      const combinedQuotation = {
        ...quotationInfo,
        services: [...quotationInfo.services, newService]
      };

      const quotationResponse = await axios.post('http://localhost:3000/api/quotations/vehicles/', {
        worker_id: vehicle.worker_id,
        car_id: vehicle.owner._id,
        ...combinedQuotation,
        total_price: totalPrice,
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (quotationResponse.status === 200) {
        setSuccess('Quotation saved successfully');
        setError(null);
      } else {
        setError('An error occurred while saving the quotation');
        setSuccess(null);
      }
    } catch (error) {
      console.error('An error occurred while saving the quotation:', error);
      setError('An error occurred while saving the quotation');
      setSuccess(null);
    }
  };

  const handleAddService = () => {
    setQuotationInfo(prevState => ({
      ...prevState,
      services: [...prevState.services, newService]
    }));

    setNewService({
      furniture: '',
      description: '',
      quantity: '',
      unitPrice: '',
      vatIncluded: false,
      total_price: true,
    });
    setService('');
    setShowTable(true);
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
            <form onSubmit={handleSubmit}>
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
                      type="text"
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
                    <select name="service" className='row' value={service} onChange={(e) => setService(e.target.value)}>
                      <option value="">Select Service</option>
                      <option value="Service A">Service A</option>
                      <option value="Service B">Service B</option>
                      <option value="Service C">Service C</option>
                    </select>
                  </label>
                </div>
                <div className='input-field'>
                  <label>
                    Parts to buy:
                    <select
                      name="furniture"
                      className='row'
                      value={newService.furniture}
                      onChange={handleServiceChange}
                    >
                      <option value="">Select Part</option>
                      {stockItems.map(stock => (
                        <option key={stock.item_id} value={stock.item_id.itemName}>{stock.item_id.itemName}</option>
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
                      className='row'
                      checked={newService.vatIncluded}
                      onChange={(e) => setNewService({ ...newService, vatIncluded: e.target.checked })}
                    />
                  </label>
                </div>
              </div>
              <div>
                <button type="button" className='success-btn' onClick={handleAddService}>Add Service</button>
              </div>
              {showTable && (
                <div>
                  <h3>Added Services</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Plate NO</th>
                        <th>Description</th>
                        <th>Part to buy</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>VAT Included</th>
                        <th>Total Price</th>
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
                            {(parseFloat(service.unitPrice) * parseFloat(service.quantity)).toFixed(2)} RWF
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="7">
                          <strong>Total Price:</strong>
                        </td>
                        <td>{calculateTotalPrice(quotationInfo.services)} RWF</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              <br />
              <div className='input-field'>
                <button onClick={handleSubmit}>Save Quotation</button>
              </div>
            </form>
            {success && <div className="success">{success}</div>}
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      )}
      {showPrintModal && <PrintModal onClose={handleClosePrintModal} />}
    </div>
  );
};

export default Quotation;
