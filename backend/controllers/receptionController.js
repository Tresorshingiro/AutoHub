const validator = require('validator')
const Vehicle = require('../models/Vehicles')
const Employee = require('../models/Employee')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const addVehicle = async (req, res)=> {
    try{
        const {vehicleBrand, vehicleType, ModelYear, PlateNo, ChassisNo, engine, customer, insurance, TinNo, concerns, status} = req.body
        const imageFile = req.file
        
        if(!vehicleBrand || !vehicleType || !ModelYear || !PlateNo || !ChassisNo || !engine || !insurance || !TinNo || !concerns ){
            return res.json({success: false, message: "All fields are required"})
        }

        if(!customer || !customer.name || !customer.email || !customer.phone ){
            return res.json({success: false, message: "Customers details are required"})
        }

        if(!validator.isEmail(customer.email)){
            return res.json({success: false, message: "Invalid email format"})
        }

        //check if vehicle with the same plateNo or chassisNo already exists
        const existingVehicle = await Vehicle.findOne({
            $or: [
                {PlateNo: PlateNo},
                {ChassisNo: ChassisNo}
            ]
        })

        if(existingVehicle){
            return res.json({success: false, message: "Vehicle with this PlateNo or ChassisNo already exists"})
        }


        //upload vehicle image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageUrl = imageUpload.secure_url

        const vehicleData = {
            vehicleBrand,
            vehicleType,
            ModelYear,
            PlateNo,
            ChassisNo,
            engine,
            image: imageUrl,
            customer: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            },
            insurance,
            TinNo,
            concerns,
            status: status || "awaiting-diagnosis"
        }

        const newVehicle = await Vehicle(vehicleData)
        await newVehicle.save()

        res.json({success: true, message: "Vehicle added successfully"})

    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API to login receptionist
const loginReceptionist = async (req, res) => {
    try{

        const {email, password} = req.body
        const employee = await Employee.findOne({email: email, role: "receptionist"})

        if(!employee){
            return res.json({success: false, message: "Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password, employee.password)

        if(isMatch){
            const token = jwt.sign({id:employee._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
            res.json({success: true, token})
        }else{
            res.json({success: false, message: "Invalid Credentials"})
        }

    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API to fetch all vehicles
const getAllVehicles = async (req, res) => {
    try{

        const vehicles = await Vehicle.find({})
        res.json({success: true, vehicles})

    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API to get one vehicle
const getOneVehicle = async (req, res) => {
    try{

        const {id} = req.params

        if(!id){
            return res.json({success: false, message: "Vehicle id is required"})
        }

        const vehicle = await Vehicle.findById(id)

        if(!vehicle){
            return res.json({success: false, message: "Vehicle not found"})
        }

        res.json({success: true, vehicle})
    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API to update vehicles data
const updateVehicle = async (req, res) => {
    try{

        const { id } = req.params;
        const {
            vehicleBrand,
            vehicleType,
            ModelYear,
            PlateNo,
            ChassisNo,
            engine,
            customer,
            insurance,
            TinNo,
            concerns,
            status
        } = req.body;
        const imageFile = req.file;

        if (!id) {
            return res.json({ success: false, message: "Vehicle ID is required" });
        }

        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.json({ success: false, message: "Vehicle not found" });
        }

        // Validate required fields
        if (!vehicleBrand || !vehicleType || !ModelYear || !PlateNo || !ChassisNo || !engine || !insurance || !TinNo || !concerns) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (!customer || !customer.name || !customer.email || !customer.phone) {
            return res.json({ success: false, message: "Customer details are required" });
        }

        if (!validator.isEmail(customer.email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        
        let imageUrl = vehicle.image; // Use existing image by default
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        // Update the vehicle
        vehicle.vehicleBrand = vehicleBrand;
        vehicle.vehicleType = vehicleType;
        vehicle.ModelYear = ModelYear;
        vehicle.PlateNo = PlateNo;
        vehicle.ChassisNo = ChassisNo;
        vehicle.engine = engine;
        vehicle.insurance = insurance;
        vehicle.TinNo = TinNo;
        vehicle.concerns = concerns;
        vehicle.status = status || vehicle.status;
        vehicle.image = imageUrl;
        vehicle.customer = {
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        };

        await vehicle.save();

        res.json({ success: true, message: "Vehicle updated successfully", vehicle });
        
    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API to delete vehicle
const deleteVehicle = async (req, res)=> {
    try{

        const {id} = req.params

        if(!id){
            return res.json({success: false, message: "Vehicle id is required"})
        }

        const vehicle = await Vehicle.findByIdAndDelete(id)

        if(!vehicle){
            return res.json({success: false, message: "Vehicle not found"})
        }

        res.json({success: true, message: "Vehicle deleted successfully"})

    } catch(error){
        console.log(error)
        res.json({success})
    }
}

const receptionDashboard = async (req, res)=> {
    try{

        const totalVehicles = await Vehicle.countDocuments()
        const inServiceVehicles = await Vehicle.countDocuments({
            status: {$in: ['awaiting-diagnosis', 'in-progress', 'waiting-parts']}
        })
        const completedVehicles = await Vehicle.countDocuments({status: 'completed'})
        const latestVehicles = await Vehicle.find({}).sort({createdAt: -1}).limit(5)

        const dashData ={
            totalVehicles,
            inServiceVehicles,
            completedVehicles,
            latestVehicles
        }

        res.json({success: true, dashData})

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
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = {
    addVehicle,
    loginReceptionist,
    getAllVehicles,
    getOneVehicle,
    updateVehicle,
    deleteVehicle,
    receptionDashboard,
    getEmployeeProfile
}