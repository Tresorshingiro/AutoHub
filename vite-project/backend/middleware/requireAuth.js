const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
    // Verify authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify and decode JWT token
        const decodedToken = jwt.verify(token, process.env.SECRET);

        // Fetch user details using _id from decoded token
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new Error('User not found');
        }

        // Attach user object to the request
        req.user = user;

        next();
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            return res.status(401).json({ error: 'Request is not authorized' });
        }
    }
};

module.exports = requireAuth;
