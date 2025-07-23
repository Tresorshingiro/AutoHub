const jwt = require('jsonwebtoken')

const authAccountant = (req, res, next) => {
    try{
        const {atoken} = req.headers
        if(!atoken){
            return res.json({success: false, message: "Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        req.employee = { id: token_decode.id }

        next()

    } catch(error) {
        console.log(error)
        res.status(400).json({message:error.message})
    }
}

module.exports = authAccountant
