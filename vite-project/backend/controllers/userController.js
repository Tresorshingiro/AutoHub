const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')



const storage = multer.diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('profileImage');


// Creating a Token

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// Get all users
const getAllUsers = async (req, res) => {
    const userData = await User.find({}).sort({createdAt: -1})

    res.status(200).json(userData)
}

// Login user
const loginUser = async (req, res) => {
    try {
        const { role, email, password } = req.body;
        const user = await User.login(role, email, password);
        const username = user.username
        
        // Check if the user's role matches the role they are attempting to log in with
        if (user.role !== role) {
            throw new Error('You are in the wrong field.');
        }

        // Log successful signup
        console.log('User Logged in successfully:', user);

        // create a token
        const token = createToken(user._id);
        res.status(200).json({ username, email, token, role, profileImage: user.profileImage });

    } catch(error) {
        // Log error during login process
        console.error('Error during Login:', error);
        
        // Handle errors during login process
        res.status(400).json({ error: error.message });
    }

} 

// Signup User
const signupUser = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const { role, username, email, password } = req.body;
            const profileImage = req.file ? req.file.path : null;

            if (!role || !username || !email || !password) {
                throw Error('All fields must be complete');
            }

            const user = await User.signup(role, username, email, password);
            if (profileImage) {
                user.profileImage = profileImage;
                await user.save();
            }

            // Log successful signup
            console.log('User signed up successfully:', user);

            // create a token
            const token = createToken(user._id);

            res.status(200).json({ username, email, token });

        } catch (error) {
            // Log error during signup process
            console.error('Error during signup:', error);

            // Handle errors during signup process
            res.status(400).json({ error: error.message });
        }
    });
};

const updateUser = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { id } = req.params;
        const { role, username, email, password } = req.body;
        const profileImage = req.file ? req.file.path : null;

        try {
            // Find the user by ID
            const user = await User.findById(id);

            if (!user) {
                throw new Error('User not found');
            }

            // Update user fields if provided
            if (role) user.role = role;
            if (username) user.username = username;
            if (email) user.email = email;
            if (password) user.password = password;
            if (profileImage) user.profileImage = profileImage;

            // Save the updated user
            await user.save();

            // Log successful update
            console.log('User updated successfully:', user);

            res.status(200).json({ message: 'User updated successfully', user });

        } catch (error) {
            // Log error during update process
            console.error('Error during update:', error);

            // Handle errors during update process
            res.status(400).json({ error: error.message });
        }
    });
};



module.exports = {
    getAllUsers,
    loginUser,
    signupUser,
    updateUser
}