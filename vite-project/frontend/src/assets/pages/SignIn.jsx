import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';


const SignIn = () =>{
    return(
        <div className='signin-container'>
            <h1>Autohub</h1>
            <label>Username:
            <input type="email"name="email"placeholder='Email'/>
            </label>
            <label>Password:
            <input type="password"name="password"id="password"placeholder='Password'/>
            </label>
            <br/>
            <a href="#">Forgot Password</a>
                <div className='btn'>
                    Sign In
                </div>
        </div>
    );
};

export default SignIn;