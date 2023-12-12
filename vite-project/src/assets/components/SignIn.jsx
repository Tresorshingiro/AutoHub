import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';


const SignIn = () =>{
    return(
        <div className='signin-container'>
            <h1>Autohub</h1>
            <h3>Username</h3>
            <h5>Enter password</h5>
            <input type="password"name="password"id="password"/>
            <br/>
            <a href="#">Forgot Password</a>
            <Link to="/reception">
                <div className='btn'>
                    Sign In
                </div>
            </Link>
        </div>
    );
};

export default SignIn;