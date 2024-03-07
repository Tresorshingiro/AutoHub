import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../App.css';
import { useParams } from 'react-router-dom';
import QuotationNav from '../components/quotationNav';

const Approved = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('ID from URL:', id);
        const response = await axios.get(`http://localhost:3000/api/cleared/vehicles/${id}`);
        const data = response.data;

        console.log('ID from URL:', id);
        console.log('API response:', data);

        setVehicle(data);
      } catch (error) {
        console.error('Error Fetching Data', error);
        console.error('Error Details:', error.response);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className='container'>
      <QuotationNav />
      <div className='box'>
        <table>
          <thead>
            <tr>
              <td>Date</td>
              <td>PlateNO</td>
              <td>Vehicle Brand</td>
              <td>Customer Name</td>
              <td>Parts to Buy</td>
              <td>Quantity</td>
              <td>Unity Price</td>
              <td>VAT</td>
              <td>Total Price</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{vehicle?.createdAt}</td>
              <td>{vehicle?.plate}</td>
              <td>{vehicle?.brand}</td>
              <td>{vehicle?.owner}</td>
              <td>{vehicle?.furniture}</td>
              <td>{vehicle?.quantity}</td>
              <td>{vehicle?.unitPrice}</td>
              <td>{vehicle?.vatIncluded}</td>
              <td>{vehicle?.total_price}</td>
              {/* You can add more fields as needed */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Approved;
