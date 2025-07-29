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
app.use(cors())

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