import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav';

const UpdateUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/${id}`, { // Ensure this matches your backend route
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                const data = response.data;
                setRole(data.role);
                setUsername(data.username);
                setEmail(data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [id, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('role', role);
        formData.append('username', username);
        formData.append('email', email);
        if (password) formData.append('password', password);
        if (profileImage) formData.append('profileImage', profileImage);

        try {
            const response = await axios.patch(`http://localhost:3000/api/users/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            console.log('User updated:', response.data);
            navigate('/users');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className='container'>
            <AdminNav />
            <div className='box'>
            {users &&(
                <form onSubmit={handleSubmit}>
                    <div className='fields'>
                        <div className='input-field'>
                            <input
                                type="text"
                                value={role}
                                className='row'
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="Role"
                            />
                        </div>
                        <div className='input-field'>
                            <input
                                type="text"
                                value={username}
                                className='row'
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                            />
                        </div>
                        <div className='input-field'>
                            <input
                                type="email"
                                value={email}
                                className='row'
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </div>
                        <div className='input-field'>
                            <input
                                type="password"
                                value={password}
                                className='row'
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                        <div className='input-field'>
                            <input
                                type="file"
                                className='row'
                                onChange={(e) => setProfileImage(e.target.files[0])}
                            />
                        </div>
                        </div>
                        <button type="submit">Update User</button>
                </form>
            )}
            </div>
        </div>
    );
};

export default UpdateUser;
