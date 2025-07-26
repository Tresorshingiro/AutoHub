const jwt = require('jsonwebtoken')

const authAccountant = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization || req.headers.atoken

        
        if(!authHeader){
            return res.status(401).json({success: false, message: "Not Authorized Login Again"})
        }
        
        // Extract token from "Bearer <token>" format or direct token
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader
        
        
        if(!token){
            return res.status(401).json({success: false, message: "Not Authorized Login Again"})
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.employee = { id: token_decode.id }
        next()

    } catch(error) {
        console.log('Auth error:', error)
        res.status(401).json({success: false, message: "Invalid token. Please login again."})
    }
}

module.exports = authAccountant
