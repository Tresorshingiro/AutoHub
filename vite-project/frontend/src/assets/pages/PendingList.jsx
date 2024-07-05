import React,{useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { FaEye, FaCheck, FaTrash  } from 'react-icons/fa';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';
import '../../App.css'
import ReceptionNav from '../components/receptionNav';
import { useAuthContext } from '../hooks/useAuthContext';

const sendLoc = "http://localhost:3000/api/cleared/vehicles";
const getLoc = "http://localhost:3000/api/quotations/vehicles/"

const PendingList = () => {
    const [Quotations, setQuotations] = useState([]); // Fix variable name to match the state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDropdowns,setOpenDropdowns] = useState({});
    const [filter, setFilter] = useState('')
    const dropdownRef = useRef(null)
    const {user} = useAuthContext()
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(getLoc, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
          setQuotations(response.data);
        } catch (err) {
          setError(err.message || 'An error occurred while fetching data.');
        } finally {
          setLoading(false);
        }
      };
  
      if (user) {
        fetchData();
        setError(null)
      } else {
        setLoading(false)
        setError('You must be logged in');
      }
    }, [user]);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
          setOpenDropdowns({});
        }
      };
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [])
  
    const toggleDropdown = (quotationId, event) => {
      event.stopPropagation()
  
      setOpenDropdowns(prevState => ({
        ...prevState,
        [quotationId]: !prevState[quotationId]
      }));
    };
  
    const handleFilterChange = (e) => {
      setFilter(e.target.value);
    };
  
    const filteredQuotation = Quotations.filter(quotation => 
    quotation.createdAt.toLowerCase().includes(filter.toLowerCase()) ||
    quotation.vatIncluded.toLowerCase().includes(filter.toLowerCase()) ||
    quotation.total_price.toLowerCase().includes(filter.toLowerCase()) ||
    quotation.owner.names.toLowerCase().includes(filter.toLowerCase()) ||
    quotation.plate_no.toLowerCase().includes(filter.toLowerCase())
    );
  return (
    <div className='container'>
      <ReceptionNav/>
      <div className='box'>
      <div className='high-table'>
      <h2><span>Pen</span>ding List</h2>
      <div className='search'>
        <input
        type='text'
        placeholder='Search...'
        className='row'
        value={filter}
        onChange={handleFilterChange}
        />
      </div>
      </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotation.map(quotation => (
                  <tr key={quotation._id}>
                    <td>{quotation.createdAt}</td>
                    <td>{quotation.car_id ?.plate_no || 'N/A'}</td>
                    <td>{quotation.car_id ?.owner.names || 'N/A'}</td>
                    <td>{quotation.repair_service_id?.stock_item}</td>
                    <td>{quotation.repair_service_id?.quantity}</td>
                    <td>{quotation.repair_service_id?.unitPrice}</td>
                    <td>{quotation.vatIncluded ? 'Yes' : 'No'}</td>
                    <td>{quotation.total_price}</td>
                   <td>
                      <div ref={dropdownRef}>
                        <IoEllipsisVerticalOutline onClick={(event) => toggleDropdown(quotation._id, event)}/>
                        {openDropdowns[quotation._id] &&(
                        <div className='more-icon'>
                          <ul className='min-menu'>
                            <li>
                              <FaEye/>
                              <span>View</span>
                            </li>
                          </ul>
                          <ul>
                            <li className='delete' onClick={() => deleteQuotation(Quotations, setQuotations, getLoc, user)}>
                              <FaTrash/>
                              <span>Delete</span>
                            </li>
                          </ul>
                        </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  )
}

export default PendingList
