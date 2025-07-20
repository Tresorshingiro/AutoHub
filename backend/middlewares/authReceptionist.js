const jwt = require('jsonwebtoken')

const authReceptionist = (req, res, next) => {
    try{

        const {rtoken} = req.headers
        if(!rtoken){
            return res.json({success: false, message: "Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(rtoken, process.env.JWT_SECRET)

        req.employee = { id: token_decode.id }

        next()

    } catch(error) {
        console.log(error)
        res.status(400).json({message:error.message})
    }
}

module.exports = authReceptionist