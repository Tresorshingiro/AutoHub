const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// Creating a Token

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// Login user
const loginUser = async (req, res) => {
    try {
        const { role, email, password } = req.body;
        const user = await User.login(role, email, password);

        // Log successful signup
        console.log('User signed up successfully:', user);

        // create a token
        const token = createToken(user._id);
        res.status(200).json({ email, token });

    } catch(error) {
        // Log error during login process
        console.error('Error during signup:', error);
        
        // Handle errors during login process
        res.status(400).json({ error: error.message });
    }

} 

// Signup User
const signupUser = async (req, res) => {
    try {
        const { role, username, email, password } = req.body;

        const user = await User.signup(role, username, email, password);

        // Log successful signup
        console.log('User signed up successfully:', user);

        // create a token
        const token = createToken(user._id);

        res.status(200).json({ username, token });

    } catch(error) {
        // Log error during signup process
        console.error('Error during signup:', error);
        
        // Handle errors during signup process
        res.status(400).json({ error: error.message });
    }
}



module.exports = {
    loginUser,
    signupUser
}