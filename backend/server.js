require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { connectCloudinary } = require('./config/cloudinary')
const adminRouter = require('./routes/adminRoutes')
const receptionRouter = require('./routes/receptionRoutes')
const mechanicRouter = require('./routes/mechanicRoutes')
const accountantRouter = require('./routes/accountantRoutes')
const managerRouter = require('./routes/managerRoutes')


const app = express()
connectCloudinary()

app.use(express.json())

// Enhanced CORS configuration for production
app.use(cors({
    origin: ['https://autohub-sigma.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'rtoken',        // Reception token
        'mtoken',        // Mechanic token
        'atoken',        // Accountant token
        'managertoken',  // Manager token
        'admintoken'     // Admin token
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
}))

// Additional middleware to handle CORS manually
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, rtoken, mtoken, atoken, managertoken, admintoken');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
})

app.use('/api/admin', adminRouter)
app.use('/api/reception', receptionRouter)
app.use('/api/mechanic', mechanicRouter)
app.use('/api/accountant', accountantRouter)
app.use('/api/manager', managerRouter)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
        console.log('Connect to DB and listenning on port', process.env.PORT)
    })
    })
    .catch((error) => {
        console.log(error)
    })