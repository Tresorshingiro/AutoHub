const validator = require('validator')
const bcrypt = require('bcrypt')
const Employee = require('../models/Employee')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')

const addEmployee = async (req, res) => {
    try{

        const {firstName, lastName, email, role, password, phoneNumber, address, gender} = req.body
        const imageFile = req.file

        if(!firstName || !lastName || !email || !role || !password || !phoneNumber || !address || !gender || !imageFile){
            return res.json({success: false, message: "All fields are required"})
        }

        //validate email format
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Invalid email format"})
        }

        //validate strong password
        if(!validator.isStrongPassword(password)){
            return res.json({success: false, message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"})
        }

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageUrl = imageUpload.secure_url

        //create employee
        const employeeData = {
            firstName,
            lastName,
            email,
            role,
            password: hashedPassword,
            phoneNumber,
            address,
            gender,
            image: imageUrl
        }

        const newEmployee = new Employee(employeeData)
        await newEmployee.save()

        res.json({success: true, message: "Employee added successfully"})

    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API to login Admin
const loginAdmin = async (req, res) => {
    try{

        const {email, password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.status(200).json({success: true, token})
        }else{
            res.json({success: false, message: "Invalid Credentials"})
        }


    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API to get all employees
const getAllEmployees = async (req, res) => {
    try{

        const employees = await Employee.find({})
        res.json({success: true, employees})

    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}


//API to get one employee
const getOneEmployee = async (req, res) => {
    try{

        const {id} = req.params

        if(!id){
            return res.json({success: false, message: "Employee id is required"})
        }

        const employee = await Employee.findById(id)

        if(!employee){
            return res.json({success: false, message: "Employee not found"})
        }

    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API to get employee profile
const getEmployeeProfile = async (req, res) => {
    try {
        const employee = await Employee.findById(req.employee.id).select('-password');
        res.json({ success: true, employee });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//API to update employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phoneNumber, address, gender, role, salary, status } = req.body;
        
        const updateData = {
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            gender,
            role,
            salary,
            status
        };

        // Handle image upload
        if (req.file) {
            updateData.image = req.file.path;
        }

        const employee = await Employee.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        
        if (!employee) {
            return res.json({ success: false, message: "Employee not found" });
        }

        res.json({ success: true, message: "Employee updated successfully", employee });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//API to delete employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        
        const employee = await Employee.findByIdAndDelete(id);
        
        if (!employee) {
            return res.json({ success: false, message: "Employee not found" });
        }

        res.json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//API to change employee password
const changeEmployeePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        
        if (!newPassword || newPassword.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const employee = await Employee.findByIdAndUpdate(
            id, 
            { password: hashedPassword }, 
            { new: true }
        ).select('-password');
        
        if (!employee) {
            return res.json({ success: false, message: "Employee not found" });
        }

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = {
    addEmployee,
    loginAdmin,
    getAllEmployees,
    getOneEmployee,
    getEmployeeProfile,
    updateEmployee,
    deleteEmployee,
    changeEmployeePassword
}