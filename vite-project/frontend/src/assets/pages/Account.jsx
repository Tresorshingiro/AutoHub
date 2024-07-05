import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import AdminNav from '../components/AdminNav';
import '../../App.css';

const Account = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in');
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('role', role);
        formData.append('password', password);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const response = await fetch('http://localhost:3000/api/users/signup', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'An error occurred while processing your request.');
                setSuccess(null);
            } else {
                const json = await response.json();
                setUserName('');
                setEmail('');
                setRole('');
                setPassword('');
                setProfileImage(null);
                setError(null);
                setSuccess('User added successfully');
                console.log('New User Added', json);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            setError('An unexpected error occurred. Please try again later.');
            setSuccess(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'username':
                setUserName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'role':
                setRole(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    return (
        <div className='container'>
            <AdminNav />
            <div className='box'>
                <h2><span>Sign</span> UP</h2>
                <form onSubmit={handleSubmit}>
                    <div className='fields'>
                        <div className='input-field'>
                            <label>
                                UserName:
                                <input
                                    type='text'
                                    name='username'
                                    className='row'
                                    placeholder='UserName'
                                    onChange={handleInputChange}
                                    value={username}
                                />
                            </label>
                        </div>
                        <div className='input-field'>
                            <label>
                                Email:
                                <input
                                    type='email'
                                    name='email'
                                    className='row'
                                    placeholder='email'
                                    onChange={handleInputChange}
                                    value={email}
                                />
                            </label>
                        </div>
                        <div className='input-field'>
                            <label>
                                Role:
                                <select name='role' className='row' value={role} onChange={handleInputChange}>
                                    <option value=''>Select role</option>
                                    <option value='Reception'>Reception</option>
                                    <option value='Operation'>Operation</option>
                                    <option value='Accountant'>Accountant</option>
                                    <option value='Admin'>Admin</option>
                                </select>
                            </label>
                        </div>
                        <div className='input-field'>
                            <label>
                                Password:
                                <input
                                    type='password'
                                    name='password'
                                    className='row'
                                    placeholder='Password'
                                    value={password}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>
                        <div className='input-field'>
                            <label>
                                Profile Image:
                                <input
                                    type='file'
                                    name='profileImage'
                                    className='row'
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>
                    <button className='large-btn'>Sign up</button>
                    {error && <div className='error'>{error}</div>}
                    {success && <div className='success'>{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default Account;
