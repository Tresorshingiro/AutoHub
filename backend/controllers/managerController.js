const Vehicle = require('../models/Vehicles')
const Service = require('../models/Service')
const Quotation = require('../models/Quotation')
const Part = require('../models/Parts')
const Supplier = require('../models/Supplier')
const Income = require('../models/Income')
const Expense = require('../models/Expense')
const Employee = require('../models/Employee')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { cloudinary } = require('../config/cloudinary')

// Login manager
const loginManager = async (req, res) => {
    try {
        const { email, password } = req.body
        const employee = await Employee.findOne({ email: email, role: "manager" })

        if (!employee) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const isMatch = await bcrypt.compare(password, employee.password)

        if (isMatch) {
            const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get manager profile
const getManagerProfile = async (req, res) => {
    try {
        const managerId = req.employee.id
        const employee = await Employee.findById(managerId).select('-password')

        if (!employee) {
            return res.json({ success: false, message: 'Manager not found' })
        }

        res.json({
            success: true,
            employee: {
                _id: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phoneNumber: employee.phoneNumber,
                address: employee.address,
                gender: employee.gender,
                role: employee.role,
                image: employee.image
            }
        })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Manager Dashboard - Get comprehensive business overview
const managerDashboard = async (req, res) => {
    try {
        // Get current month/year for monthly stats
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()
        const monthStart = new Date(currentYear, currentMonth, 1)
        const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

        // Get overall financial data
        const overallIncome = await Income.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ])

        const overallExpenses = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ])

        // Get vehicle statistics
        const vehicleStats = await Vehicle.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ])

        // Get monthly vehicle count
        const monthlyVehicles = await Vehicle.countDocuments({
            createdAt: { $gte: monthStart, $lte: monthEnd }
        })

        // Get employee statistics
        const totalEmployees = await Employee.countDocuments({ status: 'active' })
        
        // Calculate monthly payroll (sum of all active employee salaries)
        const monthlyPayroll = await Employee.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$salary' }
                }
            }
        ])

        // Get last 6 months performance data
        const last6Months = []
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1)
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
            
            last6Months.push({
                month: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
                startDate: monthStart,
                endDate: monthEnd
            })
        }

        // Get financial data for each month
        const monthlyPerformance = await Promise.all(
            last6Months.map(async (monthInfo) => {
                const [incomeData, expenseData] = await Promise.all([
                    Income.aggregate([
                        {
                            $match: {
                                date: { $gte: monthInfo.startDate, $lte: monthInfo.endDate }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$amount' }
                            }
                        }
                    ]),
                    Expense.aggregate([
                        {
                            $match: {
                                date: { $gte: monthInfo.startDate, $lte: monthInfo.endDate }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$amount' }
                            }
                        }
                    ])
                ])

                const revenue = incomeData[0]?.total || 0
                const expenses = expenseData[0]?.total || 0

                return {
                    month: monthInfo.month,
                    revenue,
                    expenses,
                    profit: revenue - expenses
                }
            })
        )

        // Get inventory alerts
        const lowStockItems = await Part.countDocuments({
            $expr: { $lte: ['$inventory.currentStock', '$inventory.minimumStock'] },
            status: 'active'
        })

        // Get supplier statistics
        const activeSuppliers = await Supplier.countDocuments({ status: 'active' })
        const totalSuppliers = await Supplier.countDocuments()

        // Calculate workflow status
        const workflow = {
            inQueue: 0,
            inService: 0,
            completed: 0,
            cleared: 0
        }

        vehicleStats.forEach(stat => {
            switch (stat._id) {
                case 'pending':
                    workflow.inQueue = stat.count
                    break
                case 'in-service':
                    workflow.inService = stat.count
                    break
                case 'completed':
                    workflow.completed = stat.count
                    break
                case 'cleared':
                    workflow.cleared = stat.count
                    break
            }
        })

        // Calculate totals
        const totalRevenue = overallIncome[0]?.total || 0
        const totalExpenses = overallExpenses[0]?.total || 0
        const netProfit = totalRevenue - totalExpenses
        const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0

        // Get recent alerts (example structure)
        const alerts = {
            pending: [
                {
                    title: 'Low Stock Alert',
                    description: 'Items running low in inventory',
                    count: lowStockItems
                },
                {
                    title: 'Pending Payments',
                    description: 'Vehicles awaiting payment clearance',
                    count: workflow.completed
                }
            ].filter(alert => alert.count > 0)
        }

        const dashboard = {
            financial: {
                totalRevenue,
                totalExpenses,
                netProfit,
                profitMargin: parseFloat(profitMargin)
            },
            employees: {
                total: totalEmployees,
                monthlyPayroll: monthlyPayroll[0]?.total || 0,
                performance: {
                    average: 85 // This would be calculated based on actual performance metrics
                }
            },
            operations: {
                totalVehicles: vehicleStats.reduce((sum, stat) => sum + stat.count, 0),
                monthlyVehicles,
                workflow,
                efficiency: {
                    averageTime: 4.5 // This would be calculated from actual service times
                }
            },
            inventory: {
                lowStockItems
            },
            suppliers: {
                active: activeSuppliers,
                total: totalSuppliers
            },
            monthlyPerformance,
            alerts
        }

        res.json({ success: true, dashboard })
    } catch (error) {
        console.error('Manager dashboard error:', error)
        res.json({ success: false, message: error.message })
    }
}

// Get operations monitoring data
const getOperationsData = async (req, res) => {
    try {
        // Get all vehicles with their current status
        const vehicles = await Vehicle.find()
            .sort({ createdAt: -1 })
            .limit(50)

        // Get service efficiency metrics
        const completedVehicles = await Vehicle.find({ status: 'completed' })
        const averageServiceTime = completedVehicles.length > 0 
            ? completedVehicles.reduce((sum, vehicle) => {
                if (vehicle.completedAt && vehicle.createdAt) {
                    const timeDiff = vehicle.completedAt - vehicle.createdAt
                    return sum + (timeDiff / (1000 * 60 * 60)) // Convert to hours
                }
                return sum
            }, 0) / completedVehicles.length
            : 0

        // Get mechanic workload - simplified since vehicles don't have assigned mechanics yet
        const mechanics = await Employee.find({ role: 'mechanic', status: 'active' })
        const mechanicWorkload = mechanics.map((mechanic) => {
            // For now, assign random workload since vehicle assignment isn't implemented
            const assignedVehicles = Math.floor(Math.random() * 6) // Random 0-5 vehicles
            return {
                mechanic: {
                    _id: mechanic._id,
                    name: `${mechanic.firstName} ${mechanic.lastName}`
                },
                assignedVehicles,
                status: assignedVehicles > 5 ? 'overloaded' : assignedVehicles > 2 ? 'busy' : 'available'
            }
        })

        // Get vehicle status distribution
        const statusDistribution = await Vehicle.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ])

        const operations = {
            vehicles: vehicles.map(vehicle => ({
                _id: vehicle._id,
                vehicleBrand: vehicle.vehicleBrand,
                vehicleType: vehicle.vehicleType,
                PlateNo: vehicle.PlateNo,
                customer: vehicle.customer,
                status: vehicle.status,
                paymentStatus: vehicle.paymentStatus,
                totalAmount: vehicle.totalAmount,
                createdAt: vehicle.createdAt,
                updatedAt: vehicle.updatedAt
            })),
            efficiency: {
                averageServiceTime: averageServiceTime.toFixed(1),
                totalVehicles: vehicles.length,
                completedVehicles: completedVehicles.length
            },
            mechanicWorkload,
            statusDistribution
        }

        res.json({ success: true, operations })
    } catch (error) {
        console.error('Operations data fetch error:', error)
        res.json({ success: false, message: error.message })
    }
}

// Employee Management Functions
const getEmployees = async (req, res) => {
    try {
        console.log('Manager: Fetching all employees...')
        const employees = await Employee.find({})
            .select('-password')
            .sort({ createdAt: -1 })
        
        console.log('Manager: Found employees:', employees.length)
        console.log('Manager: Employee sample:', employees.slice(0, 2).map(emp => ({
            name: `${emp.firstName} ${emp.lastName}`,
            role: emp.role,
            status: emp.status
        })))

        res.json({ success: true, employees })
    } catch (error) {
        console.error('Get employees error:', error)
        res.json({ success: false, message: error.message })
    }
}

const addEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, role, salary, address, gender, password } = req.body

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email })
        if (existingEmployee) {
            return res.json({ success: false, message: 'Employee with this email already exists' })
        }

        // Handle password - use custom password if provided, otherwise generate default
        const employeePassword = password || 'AutoHub123'
        const hashedPassword = await bcrypt.hash(employeePassword, 10)

        let imageUrl = null

        // Handle image upload if provided
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'employees',
                        transformation: [
                            { width: 400, height: 400, crop: 'fill' },
                            { quality: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error)
                            throw error
                        }
                        return result
                    }
                )

                // Convert buffer to stream and upload
                const streamifier = require('streamifier')
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'image',
                            folder: 'employees',
                            transformation: [
                                { width: 400, height: 400, crop: 'fill' },
                                { quality: 'auto' }
                            ]
                        },
                        (error, result) => {
                            if (error) {
                                reject(error)
                            } else {
                                resolve(result)
                            }
                        }
                    )
                    streamifier.createReadStream(req.file.buffer).pipe(uploadStream)
                })

                imageUrl = uploadResult.secure_url
            } catch (uploadError) {
                console.error('Image upload error:', uploadError)
                return res.json({ success: false, message: 'Failed to upload image' })
            }
        }

        const employee = new Employee({
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            salary,
            address,
            gender,
            password: hashedPassword,
            status: 'active',
            ...(imageUrl && { image: imageUrl })
        })

        await employee.save()

        res.json({
            success: true,
            message: 'Employee added successfully',
            employee: {
                _id: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phoneNumber: employee.phoneNumber,
                role: employee.role,
                salary: employee.salary,
                address: employee.address,
                gender: employee.gender,
                status: employee.status,
                image: employee.image
            }
        })
    } catch (error) {
        console.error('Add employee error:', error)
        res.json({ success: false, message: error.message })
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params
        const { firstName, lastName, email, phoneNumber, role, salary, address, gender, status, password } = req.body

        // Prepare update data
        const updateData = {
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            salary,
            address,
            gender,
            status
        }

        // Handle password update if provided
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10)
            updateData.password = hashedPassword
        }

        // Handle image upload if provided
        if (req.file) {
            try {
                // Upload new image to cloudinary
                const streamifier = require('streamifier')
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'image',
                            folder: 'employees',
                            transformation: [
                                { width: 400, height: 400, crop: 'fill' },
                                { quality: 'auto' }
                            ]
                        },
                        (error, result) => {
                            if (error) {
                                reject(error)
                            } else {
                                resolve(result)
                            }
                        }
                    )
                    streamifier.createReadStream(req.file.buffer).pipe(uploadStream)
                })

                updateData.image = uploadResult.secure_url
            } catch (uploadError) {
                console.error('Image upload error:', uploadError)
                return res.json({ success: false, message: 'Failed to upload image' })
            }
        }

        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            updateData,
            { new: true }
        ).select('-password')

        if (!employee) {
            return res.json({ success: false, message: 'Employee not found' })
        }

        res.json({
            success: true,
            message: 'Employee updated successfully',
            employee
        })
    } catch (error) {
        console.error('Update employee error:', error)
        res.json({ success: false, message: error.message })
    }
}

const deleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params

        // Soft delete - set status to inactive
        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            { status: 'inactive' },
            { new: true }
        )

        if (!employee) {
            return res.json({ success: false, message: 'Employee not found' })
        }

        res.json({
            success: true,
            message: 'Employee deleted successfully'
        })
    } catch (error) {
        console.error('Delete employee error:', error)
        res.json({ success: false, message: error.message })
    }
}

// Payroll Management Functions
const getPayrolls = async (req, res) => {
    try {
        const { year, month, status } = req.query
        
        let query = {
            category: 'salaries'
        }
        
        if (year && month) {
            const startDate = new Date(year, month - 1, 1)
            const endDate = new Date(year, month, 0, 23, 59, 59)
            query.date = { $gte: startDate, $lte: endDate }
        }

        // Get salary expenses and group them by month/year
        const salaryExpenses = await Expense.find(query)
            .populate('accountantId', 'firstName lastName role')
            .populate('employeeId', 'firstName lastName role')
            .sort({ date: -1 })

        // Group expenses by month/year to create payroll records
        const payrollMap = new Map()
        
        salaryExpenses.forEach(expense => {
            const date = new Date(expense.date)
            const payrollKey = `${date.getFullYear()}-${date.getMonth() + 1}`
            
            if (!payrollMap.has(payrollKey)) {
                payrollMap.set(payrollKey, {
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                    totalAmount: 0,
                    employeeCount: 0,
                    employees: new Set(),
                    processedBy: expense.accountantId ? 
                        `${expense.accountantId.firstName} ${expense.accountantId.lastName}` : 'Unknown',
                    createdAt: expense.createdAt,
                    expenses: []
                })
            }
            
            const payroll = payrollMap.get(payrollKey)
            payroll.totalAmount += expense.amount
            payroll.employees.add(expense.employeeId?._id?.toString())
            payroll.expenses.push({
                employeeId: expense.employeeId?._id,
                employeeName: expense.employeeId ? 
                    `${expense.employeeId.firstName} ${expense.employeeId.lastName}` : 'Unknown',
                amount: expense.amount,
                description: expense.description
            })
        })

        // Convert map to array and calculate employee counts
        const payrolls = Array.from(payrollMap.values()).map(payroll => ({
            ...payroll,
            employeeCount: payroll.employees.size,
            employees: undefined // Remove the Set object
        }))

        res.json({ success: true, payrolls })
    } catch (error) {
        console.error('Get payrolls error:', error)
        res.json({ success: false, message: error.message })
    }
}

const generatePayroll = async (req, res) => {
    try {
        const { year, month, employees } = req.body

        // Find an accountant to assign to the expense
        const accountant = await Employee.findOne({ role: 'accountant', status: 'active' })
        if (!accountant) {
            return res.json({ 
                success: false, 
                message: 'No active accountant found. An accountant is required to process payroll.' 
            })
        }

        const payrollDate = new Date(year, month - 1, 1)
        const payrollExpenses = []

        // Generate payroll for each employee
        for (const emp of employees) {
            const employee = await Employee.findById(emp.employeeId)
            if (!employee) continue

            // Create expense record for salary using the net salary from frontend calculation
            const salaryExpense = new Expense({
                description: `Salary for ${employee.firstName} ${employee.lastName} - ${month}/${year}`,
                amount: emp.netSalary || employee.salary,
                category: 'salaries',
                date: payrollDate,
                paymentMethod: 'bank_transfer',
                notes: `Monthly salary payment - Base: ${emp.baseSalary}, Overtime: ${emp.overtime || 0}, Bonuses: ${emp.bonuses || 0}, Deductions: ${emp.deductions || 0}`,
                employeeId: employee._id,
                accountantId: accountant._id
            })

            await salaryExpense.save()
            payrollExpenses.push(salaryExpense)
        }

        res.json({
            success: true,
            message: 'Payroll generated successfully',
            payroll: {
                month,
                year,
                totalAmount: payrollExpenses.reduce((sum, expense) => sum + expense.amount, 0),
                employeeCount: payrollExpenses.length,
                expenses: payrollExpenses,
                processedBy: accountant.firstName + ' ' + accountant.lastName
            }
        })
    } catch (error) {
        console.error('Generate payroll error:', error)
        res.json({ success: false, message: error.message })
    }
}

// Download payroll as CSV
const downloadPayrollCSV = async (req, res) => {
    try {
        const { year, month } = req.params
        
        // Get salary expenses for the specified month/year
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0, 23, 59, 59)
        
        const salaryExpenses = await Expense.find({
            category: 'salaries',
            date: { $gte: startDate, $lte: endDate }
        })
            .populate('employeeId', 'firstName lastName role')
            .populate('accountantId', 'firstName lastName')
            .sort({ date: 1 })

        if (salaryExpenses.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No payroll data found for the specified period' 
            })
        }

        // Create CSV content
        const headers = [
            'Employee Name',
            'Role', 
            'Salary Amount',
            'Payment Date',
            'Processed By',
            'Description'
        ]

        const csvRows = salaryExpenses.map(expense => [
            expense.employeeId ? 
                `${expense.employeeId.firstName} ${expense.employeeId.lastName}` : 'Unknown',
            expense.employeeId?.role || 'Unknown',
            expense.amount,
            expense.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            expense.accountantId ? 
                `${expense.accountantId.firstName} ${expense.accountantId.lastName}` : 'Unknown',
            expense.description
        ])

        const csvContent = [
            headers.join(','),
            ...csvRows.map(row => 
                row.map(field => 
                    typeof field === 'string' && field.includes(',') ? 
                        `"${field}"` : field
                ).join(',')
            )
        ].join('\n')

        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename="payroll-${month}-${year}.csv"`)
        res.send(csvContent)

    } catch (error) {
        console.error('Download payroll CSV error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get suppliers with their parts
const getSuppliersWithParts = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ status: 'active' })

        const suppliersWithParts = await Promise.all(
            suppliers.map(async (supplier) => {
                const parts = await Part.find({ supplier: supplier._id })
                    .select('name partNumber category pricing inventory')

                return {
                    ...supplier.toObject(),
                    parts,
                    totalParts: parts.length,
                    totalValue: parts.reduce((sum, part) => {
                        return sum + ((part.inventory?.currentStock || 0) * (part.pricing?.sellingPrice || 0))
                    }, 0)
                }
            })
        )

        res.json({ success: true, suppliers: suppliersWithParts })
    } catch (error) {
        console.error('Get suppliers with parts error:', error)
        res.json({ success: false, message: error.message })
    }
}

// Generate manager reports
const generateManagerReports = async (req, res) => {
    try {
        const { startDate, endDate, reportType, dateRange } = req.query

        // Set default date range if not provided
        let start, end
        if (startDate && endDate) {
            start = new Date(startDate)
            end = new Date(endDate)
        } else {
            // Default to current month if no dates provided
            const now = new Date()
            start = new Date(now.getFullYear(), now.getMonth(), 1)
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        }

        let reports = {}

        // Financial Reports
        if (reportType === 'financial' || !reportType) {
            // Income analysis
            const incomeData = await Income.aggregate([
                {
                    $match: {
                        date: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ])

            // Expense analysis
            const expenseData = await Expense.aggregate([
                {
                    $match: {
                        date: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ])

            // Monthly trend data
            const monthlyIncome = await Income.aggregate([
                {
                    $match: {
                        date: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$date' },
                            month: { $month: '$date' }
                        },
                        revenue: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])

            const monthlyExpenses = await Income.aggregate([
                {
                    $match: {
                        date: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$date' },
                            month: { $month: '$date' }
                        },
                        expenses: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])

            const totalIncome = incomeData.reduce((sum, item) => sum + item.total, 0)
            const totalExpenses = expenseData.reduce((sum, item) => sum + item.total, 0)

            reports.financial = {
                summary: {
                    totalRevenue: totalIncome,
                    totalExpenses: totalExpenses,
                    netProfit: totalIncome - totalExpenses,
                    profitMargin: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(2) : 0,
                    transactionCount: incomeData.reduce((sum, item) => sum + item.count, 0)
                },
                incomeByCategory: incomeData,
                expenseByCategory: expenseData,
                monthlyTrend: monthlyIncome.map(income => {
                    const expense = monthlyExpenses.find(exp => 
                        exp._id.year === income._id.year && exp._id.month === income._id.month
                    )
                    return {
                        month: new Date(income._id.year, income._id.month - 1).toLocaleDateString('en', { month: 'short' }),
                        revenue: income.revenue,
                        expenses: expense?.expenses || 0,
                        profit: income.revenue - (expense?.expenses || 0)
                    }
                })
            }
        }

        // Operations Reports
        if (reportType === 'operational' || !reportType) {
            const vehicleStats = await Vehicle.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ])

            const serviceStats = await Service.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: '$serviceType',
                        count: { $sum: 1 },
                        totalCost: { $sum: '$cost' }
                    }
                }
            ])

            reports.operational = {
                vehicleStats,
                serviceStats,
                totalVehicles: vehicleStats.reduce((sum, stat) => sum + stat.count, 0),
                completedVehicles: vehicleStats.find(stat => stat._id === 'completed')?.count || 0
            }
        }

        // Inventory Reports
        if (reportType === 'inventory' || !reportType) {
            const inventoryStats = await Part.aggregate([
                {
                    $group: {
                        _id: '$category',
                        totalParts: { $sum: 1 },
                        totalStock: { $sum: '$stockQuantity' },
                        totalValue: { $sum: { $multiply: ['$stockQuantity', '$unitPrice'] } },
                        lowStockItems: {
                            $sum: {
                                $cond: [
                                    { $lte: ['$stockQuantity', '$minimumStock'] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ])

            const lowStockParts = await Part.find({
                $expr: { $lte: ['$stockQuantity', '$minimumStock'] }
            }).select('name partNumber stockQuantity minimumStock category')

            reports.inventory = {
                categoryStats: inventoryStats,
                lowStockParts,
                totalValue: inventoryStats.reduce((sum, cat) => sum + cat.totalValue, 0),
                totalLowStock: lowStockParts.length
            }
        }

        // Employee Reports
        if (reportType === 'employee' || !reportType) {
            const employeeStats = await Employee.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 },
                        totalSalary: { $sum: '$salary' }
                    }
                }
            ])

            const recentPayroll = await Expense.find({
                category: 'salaries',
                date: { $gte: start, $lte: end }
            }).populate('employeeId', 'firstName lastName role')

            reports.employee = {
                roleDistribution: employeeStats,
                totalEmployees: employeeStats.reduce((sum, stat) => sum + stat.count, 0),
                totalPayroll: recentPayroll.reduce((sum, expense) => sum + expense.amount, 0),
                recentPayroll
            }
        }

        // Customer Reports
        if (reportType === 'customer' || !reportType) {
            const customerStats = await Vehicle.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: '$customer.name',
                        vehicleCount: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' },
                        avgAmount: { $avg: '$totalAmount' }
                    }
                },
                { $sort: { totalAmount: -1 } }
            ])

            const customerTypes = await Vehicle.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: '$vehicleType',
                        count: { $sum: 1 },
                        totalRevenue: { $sum: '$totalAmount' }
                    }
                }
            ])

            reports.customer = {
                customerStats,
                customerTypes,
                totalCustomers: customerStats.length,
                totalRevenue: customerStats.reduce((sum, customer) => sum + (customer.totalAmount || 0), 0)
            }
        }

        // Payroll Reports  
        if (reportType === 'payroll' || !reportType) {
            const payrollStats = await Expense.aggregate([
                {
                    $match: {
                        category: 'salaries',
                        date: { $gte: start, $lte: end }
                    }
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employeeId',
                        foreignField: '_id',
                        as: 'employee'
                    }
                },
                {
                    $unwind: '$employee'
                },
                {
                    $group: {
                        _id: '$employee.role',
                        totalPaid: { $sum: '$amount' },
                        employeeCount: { $sum: 1 },
                        avgSalary: { $avg: '$amount' }
                    }
                }
            ])

            const monthlyPayroll = await Expense.aggregate([
                {
                    $match: {
                        category: 'salaries',
                        date: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$date' },
                            month: { $month: '$date' }
                        },
                        totalPaid: { $sum: '$amount' },
                        employeeCount: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])

            reports.payroll = {
                payrollStats,
                monthlyPayroll,
                totalPayroll: payrollStats.reduce((sum, stat) => sum + stat.totalPaid, 0),
                totalEmployeesPaid: payrollStats.reduce((sum, stat) => sum + stat.employeeCount, 0)
            }
        }

        res.json({ success: true, reports })
    } catch (error) {
        console.error('Generate manager reports error:', error)
        res.json({ success: false, message: error.message })
    }
}

module.exports = {
    // Authentication
    loginManager,
    getManagerProfile,

    // Dashboard
    managerDashboard,

    // Operations
    getOperationsData,

    // Employee management
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,

    // Payroll management
    getPayrolls,
    generatePayroll,
    downloadPayrollCSV,

    // Supplier management
    getSuppliersWithParts,

    // Reports
    generateManagerReports
}
