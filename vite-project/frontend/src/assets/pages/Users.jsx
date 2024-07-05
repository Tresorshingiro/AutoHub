import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { useAuthContext } from '../hooks/useAuthContext'
import AdminNav from '../components/AdminNav'
import '../../App.css'
import { IoEllipsisVerticalOutline } from 'react-icons/io5'
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Users = () => {
    const [users, setUsers] = useState([])
    const [openDropdowns, setOpenDropdowns] = useState(true)
    const [viewUser, setViewUser] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const dropdownRef = useRef(null)
    const { user } = useAuthContext();

    const toggleDropdown = (usersId, event) => {
        event.stopPropagation();

        setOpenDropdowns(prevState => ({
            ...prevState,
            [usersId]: !prevState[usersId]
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users/', {
                    headers: {
                        'Authorization': `Beare ${user.token}`
                    }
                });
                setUsers(response.data)
                setOpenDropdowns({})
            } catch(err) {
                setError(err.message || 'An error occurred while fetching data.');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        if(user) {
            fetchData();
            setError(null);
        } else {
            setLoading(false);
            setError('You must be logged in');
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contatins(event.target)) {
                setOpenDropdowns({});
            }
        };
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleViewUser = (usersId) => {
        setUsers(usersId);
        setViewUser(true);
    };


  return (
    <div className='container'>
        <AdminNav/>
        <div className='box'>
           <div className='high-table'>
            <div className='add'>
            <h2><span>Use</span>rs</h2>
            <Link to='/account' className='addbtn'>
              <button> <FaPlus/> </button>
            </Link>
            </div>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ): (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <div ref={dropdownRef}>
                                        <IoEllipsisVerticalOutline onClick={(event) => toggleDropdown(user._id, event)}/>
                                        {openDropdowns[user._id] &&(
                                            <div className='more-icon'>
                                                <ul className='min-menu'>
                                                    <Link to={`/updateUser/${user._id}`}>
                                                    <li>
                                                        <FaEdit/>
                                                        <span>Edit</span>
                                                    </li>
                                                    </Link>
                                                </ul>
                                                <ul>
                                                    <li className='delete'>
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

export default Users
