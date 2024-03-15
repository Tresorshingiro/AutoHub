import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../App.css';
import { useLogin } from '../hooks/useLogin';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useLogin();
    
    // Access location state
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const role = params.get('role');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(role, email, password);
    };

    return (
        <form className='signin-container' onSubmit={handleSubmit}>
            <h1>{role}</h1>
            <label>Email:
                <input
                    type="text"
                    placeholder='email'
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    value={email}
                    required
                />
            </label><br />
            <label>Password:
                <input
                    type="password"
                    placeholder='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
            </label><br />
            <button disabled={isLoading} type="submit" className="btn">Login</button>
            {error && <div className='error'>{error}</div>}
        </form>
    );
};

export default SignIn;
