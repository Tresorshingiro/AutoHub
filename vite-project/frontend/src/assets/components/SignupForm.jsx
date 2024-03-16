import React, { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext'

const SignUp = () =>{
    const [role, setRole] = useState('Reception') // so you don't have to explicitly click the first option
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signup, isLoading, error} = useSignup()
    const { logout } = useLogout()
    const { user } = useAuthContext()

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(role, username, email, password)
    };

    // dropdown value handler
    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    // Logout handler
    const handleLogout = (e) => {
        e.preventDefault()
        logout()
    }

    return (
        <form className='SignUp' onSubmit={handleSubmit}>
            <h1>SignUp User</h1>

            <label>Role:
                <select name="role" onChange={handleRoleChange} value={role}>
                    <option value="Reception">Reception</option>
                    <option value="Operations">Operations</option>
                    <option value="Management">Management</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Admin">Admin</option>
                </select>
            </label><br />

            <label>Username:
                <input
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </label><br />

            <label>Email:
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    value={email}
                />
            </label><br />

            <label>Password:
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </label><br />

            {!user && <button disabled={isLoading} type="submit" className="btn">Sign Up</button>}
            {user && <button onClick={handleLogout} className='btn' style={{backgroundColor: "red"}}>Logout</button>}
            {error && <div className='error'>{error}</div>}
        </form>
    );
};

export default SignUp;
