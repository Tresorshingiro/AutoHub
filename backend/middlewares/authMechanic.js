const jwt = require('jsonwebtoken')

const authMechanic = (req, res, next) => {
    try{
        const {mtoken} = req.headers
        if(!mtoken){
            return res.json({success: false, message: "Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(mtoken, process.env.JWT_SECRET)

        req.employee = { id: token_decode.id }

        next()

    } catch(error) {
        console.log(error)
        res.status(400).json({message:error.message})
    }
}

module.exports = authMechanic
