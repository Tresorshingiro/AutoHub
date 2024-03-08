import React, { useState } from 'react';

const SignUp = () =>{
    const [role, setRole] = useState('accountant');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log(role, username, email, password)
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    return (
        <form className='SignUp' onSubmit={handleSubmit}>
            <h1>SignUp User</h1>

            <label>Role:
                <select name="role" onChange={handleRoleChange} value={role}>
                    <option value="accountant">Accountant</option>
                    <option value="operations">Operations</option>
                    <option value="management">Management</option>
                    <option value="administrator">Administrator</option>
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
                    onChange={(e) => setEmail(e.target.value)}
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

            <button type="submit" className="btn">Sign Up</button>
        </form>
    );
};

export default SignUp;
