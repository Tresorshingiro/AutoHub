const validator = require('validator')
const bcrypt = require('bcrypt')
const Employee = require('../models/Employee')
const Vehicles = require('../models/Vehicles')
const Service = require('../models/Service')
const Expense = require('../models/Expense')
const Income = require('../models/Income')
const Parts = require('../models/Parts')
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

        //upload image to cloudinary using buffer
        const imageUpload = await cloudinary.uploader.upload(
            `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`, 
            {
                resource_type: "image",
                folder: "autohub/employees" // Optional: organize images in folders
            }
        )
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
            //upload new employee image to cloudinary using buffer
            const imageUpload = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, 
                {
                    resource_type: "image",
                    folder: "autohub/employees" // Optional: organize images in folders
                }
            )
            updateData.image = imageUpload.secure_url;
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

//API to get admin dashboard data
const getAdminDashboard = async (req, res) => {
    try {
        // Get counts
        const totalEmployees = await Employee.countDocuments();
        const activeEmployees = await Employee.countDocuments({ status: 'active' });
        const inactiveEmployees = await Employee.countDocuments({ status: 'inactive' });
        
        // Get vehicles data
        const totalVehicles = await Vehicles.countDocuments();
        const vehiclesInService = await Vehicles.countDocuments({ 
            status: { $in: ['awaiting-diagnosis', 'in-progress', 'waiting-parts'] } 
        });
        const completedVehicles = await Vehicles.countDocuments({ status: 'completed' });
        
        // Get financial data for current month
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const monthlyIncome = await Income.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        
        const monthlyExpenses = await Expense.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        
        // Get employee distribution by role
        const employeesByRole = await Employee.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get recent employees (last 5)
        const recentEmployees = await Employee.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName role status createdAt');
        
        // Get monthly employee growth (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const employeeGrowth = await Employee.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        
        // Get total payroll
        const totalPayroll = await Employee.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$salary" }
                }
            }
        ]);

        const dashboardData = {
            overview: {
                totalEmployees,
                activeEmployees,
                inactiveEmployees,
                totalVehicles,
                vehiclesInService,
                completedVehicles,
                monthlyIncome: monthlyIncome[0]?.total || 0,
                monthlyExpenses: monthlyExpenses[0]?.total || 0,
                totalPayroll: totalPayroll[0]?.total || 0
            },
            employeesByRole: employeesByRole.map(item => ({
                role: item._id,
                count: item.count
            })),
            recentEmployees,
            employeeGrowth: employeeGrowth.map(item => ({
                month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                count: item.count
            }))
        };

        res.json({ success: true, data: dashboardData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//API to generate admin reports
const generateAdminReports = async (req, res) => {
    try {
        const { reportType, startDate, endDate } = req.query;
        
        let start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
        let end = endDate ? new Date(endDate) : new Date();
        
        let reportData = {};
        
        switch (reportType) {
            case 'employees':
                const employees = await Employee.find({
                    createdAt: { $gte: start, $lte: end }
                }).select('-password');
                
                const employeeStats = await Employee.aggregate([
                    {
                        $group: {
                            _id: "$role",
                            count: { $sum: 1 },
                            totalSalary: { $sum: "$salary" }
                        }
                    }
                ]);
                
                reportData = {
                    employees,
                    statistics: employeeStats,
                    summary: {
                        totalEmployees: employees.length,
                        totalSalaryExpense: employeeStats.reduce((sum, item) => sum + item.totalSalary, 0)
                    }
                };
                break;
                
            case 'financial':
                const incomes = await Income.find({
                    date: { $gte: start, $lte: end }
                });
                
                const expenses = await Expense.find({
                    date: { $gte: start, $lte: end }
                });
                
                const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
                const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
                
                reportData = {
                    incomes,
                    expenses,
                    summary: {
                        totalIncome,
                        totalExpenses,
                        netProfit: totalIncome - totalExpenses,
                        transactionCount: incomes.length + expenses.length
                    }
                };
                break;
                
            case 'vehicles':
                const vehicles = await Vehicles.find({
                    createdAt: { $gte: start, $lte: end }
                }).populate('customer', 'name email phone');
                
                const vehicleStats = await Vehicles.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: start, $lte: end }
                        }
                    },
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ]);
                
                reportData = {
                    vehicles,
                    statistics: vehicleStats,
                    summary: {
                        totalVehicles: vehicles.length,
                        completedServices: vehicleStats.find(s => s._id === 'completed')?.count || 0
                    }
                };
                break;
                
            default:
                return res.json({ success: false, message: "Invalid report type" });
        }
        
        res.json({ success: true, data: reportData });
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
    changeEmployeePassword,
    getAdminDashboard,
    generateAdminReports
}