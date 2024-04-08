import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuotationNav from '../components/quotationNav';
import axios from 'axios';
import PrintModal from '../components/PrintModal';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext'


const Quotation = () => {
  const { id } = useParams(); 
  const [vehicle, setVehicles] = useState(undefined);  
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('ID from URL:', id);
        const response = await axios.get(`http://localhost:3000/api/vehicles/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = response.data;
        
        console.log('ID from URL:', id);
        console.log('API response:', data);

        setVehicles(data);

      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response);
      }
    };

    if (user) {
      fetchData();
      setError(null)
    } else {
      setError('You must be logged in');
    }
    
  }, [user]);

  const [quotationInfo, setQuotationInfo] = useState({
    date: '',
    plateNo: '',
    customerName: '',
    vehicleBrand: '',
    services: [],
  });

  const [newService, setNewService] = useState({
    furniture: '',
    description:'',
    quantity: '',
    unitPrice: '',
    vatIncluded: false,
    total_price:true,
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

  const handleAddService = async (vehicle, newService) => {
    try {
      // Add the new service to the quotation services
      const updatedServices = [...quotationInfo.services, newService];
    
      // Calculate the total price based on updated services
      const totalPrice = calculateTotalPrice(updatedServices);
    
      const quotationResponse = await axios.post('http://localhost:3000/api/quotations/vehicles', {
        worker_id: vehicle.worker_id,
        brand: vehicle.brand,
        owner: vehicle.owner,
        plate: vehicle.plate,
        type: vehicle.type,
        service: vehicle.service,
        createdAt: vehicle.createdAt,
        furniture: newService.furniture,
        description: newService.description,
        quantity: newService.quantity,
        unitPrice: newService.unitPrice,
        vatIncluded: newService.vatIncluded,
        total_price: totalPrice
      },
      {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
    
      if (quotationResponse.status === 200) {
        setQuotationInfo({
          ...quotationInfo,
          services: updatedServices,
          total_price: totalPrice,
        });
    
        setNewService({
          furniture: '',
          description:'',
          quantity: 0,
          unitPrice: 0,
          vatIncluded: false,
        });
    
        setSuccess('Service added successfully');
        setError(null);
      } else {
        console.error('Error:', quotationResponse.statusText);
        const errorData = quotationResponse.data; // Directly access response data
        console.error('Error Details:', errorData);
        setError(errorData);
        setSuccess(null);
      }
    } catch (error) {
      console.error('An error occurred while adding service:', error);
      setError('An error occurred while adding service');
      setSuccess(null);
    }
  };
  
  
  

  const calculateTotalPrice = (updatedServices) => {
    return updatedServices.reduce((total, service) => {
      const unitPrice = parseFloat(service.unitPrice) || 0;
      const quantity = parseFloat(service.quantity) || 0;
      const totalPrice = unitPrice * quantity;
  
      return total + (service.vatIncluded ? totalPrice * 1.18 : totalPrice);
    }, 0).toFixed(2);
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in')
      return
    }
    
    console.log('Submitted Quotation Info:', quotationInfo);
  };

  const handleClosePrintModal = () => {
    setShowPrintModal(false); 
  };
  const handlePrint = () => {
    console.log("Print button clicked");
    setShowPrintModal(true);
  };

  return (
    <div className="container">
        <QuotationNav/>
      {vehicle && (
      <div className='box'>
      <h3>Add Quotation</h3>
        <div className='add-quotation'>
          <form className='addquota'>
          <label>
            Date:
            <input
              type="text"
              name="date"
              value={vehicle.createdAt}
              onChange={handleQuotationChange}
            />
          </label>
          <label>
            PlateNo:
            <input
              type="text"
              name="plateNo"
              value={vehicle.plate}
              onChange={handleQuotationChange}
              placeholder='PlateNo'
            />
          </label>
          <label>
            Customer Name:
            <input
              type="text"
              name="customerName"
              value={vehicle.owner}
              onChange={handleQuotationChange}
              placeholder='Customer Name'
            />
          </label>
          <label>
            Vehicle Brand:
            <input
              type="text"
              name="vehicleBrand"
              value={vehicle.brand}
              onChange={handleQuotationChange}
              placeholder='Vehicle Brand'
            />
          </label>
          <label>
            Category:
            <input
            type="text"
            name="service"
            value={vehicle.service}
            onChange={handleQuotationChange}
            placeholder='Service Category'
            />
          </label>
          <label>
            Description:
            <textarea
            text="text"
            name="description"
            value={newService.description}
            onChange={handleServiceChange}
            placeholder='Description'
            />
          </label>
          <label>
            Parts to buy:
            <textarea
              type="text"
              name="furniture"
              value={newService.furniture}
              onChange={handleServiceChange}
              placeholder='Parts to buy'
            />
          </label>
          </form>
          <form className='addquota'>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={newService.quantity}
              onChange={handleServiceChange}
            />
          </label>
          <label>
            Unit Price:
            <input
              type="number"
              name="unitPrice"
              value={newService.unitPrice}
              onChange={handleServiceChange}
            />
          </label>
          <label>
            VAT Included:
            <input
              type="checkbox"
              name="vatIncluded"
              checked={newService.vatIncluded}
              onChange={() => setNewService({ ...newService, vatIncluded: !newService.vatIncluded })}
            />
          </label>
          </form>
        </div>
        <button type="button" className='addservice'onClick={() => handleAddService(vehicle, newService, calculateTotalPrice)}>Add Service</button>
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
                  <th>Parts to buy</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>VAT</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {quotationInfo.services.map((service, index) => (
                  <tr key={index}>
                    <td>{vehicle.createdAt}</td>
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
               <td>${calculateTotalPrice(quotationInfo.services)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}


        <br />
        <div className='buttons'>
            <button type="submit" onClick={handlePrint}>Save</button>
          </div>

          {/* Display the print modal when showPrintModal is true */}
          {showPrintModal && (
            <PrintModal onClose={handleClosePrintModal} vehicle={vehicle} services={quotationInfo.services} total_price={quotationInfo.total_price} />
          )}
        </div>
  )
}
      </div>
  );
};

export default Quotation;
