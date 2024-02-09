const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT;
const cars_routes = require('./routes/cars_routes');
const CarModel = require('./models/Reception_car');

//initialise the app
const app = express();

// Enbale CORS
app.use(cors());

// Middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Routes
app.use('/api/vehicles', cars_routes);


app.get('/getReceptioncars', (req, res)=>{
    CarModel.find()
    .then(car_data => res.json(car_data))
    .catch(err => res.json(err))
})
app.post('/addSupplier', (req, res) => {
    const supplierData = req.body;
    res.json({ message: 'Supplier added successfully' });
  });
  

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests
        app.listen(PORT, () => console.log(`Connected to DB & listening on port ${PORT}`));
    })
    .catch(console.error);

// Operations is next

