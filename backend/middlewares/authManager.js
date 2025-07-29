const jwt = require('jsonwebtoken')
const Employee = require('../models/Employee')

const authManager = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        
        if (!authorization) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' })
        }

        const token = authorization.split(' ')[1]
        
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        
        const employee = await Employee.findById(token_decode.id)
        
        if (!employee) {
            return res.json({ success: false, message: 'Employee not found' })
        }

        if (employee.role !== 'manager') {
            return res.json({ success: false, message: 'Not Authorized. Manager access required' })
        }

        if (employee.status !== 'active') {
            return res.json({ success: false, message: 'Account is inactive' })
        }

        req.employee = {
            id: employee._id,
            email: employee.email,
            role: employee.role,
            firstName: employee.firstName,
            lastName: employee.lastName
        }
        
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

module.exports = authManager
