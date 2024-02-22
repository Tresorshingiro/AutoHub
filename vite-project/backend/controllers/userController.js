const User = require('../models/userModel')

// Login user
const loginUser = async (req, res) => {
    res.json({mssg: 'User login'})
} 

// Signup User
// Signup User
const signupUser = async (req, res) => {
    try {
        const { role, username, email, password } = req.body;

        const user = await User.signup(role, username, email, password);

        // Log successful signup
        console.log('User signed up successfully:', user);

        res.status(200).json({ user });

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