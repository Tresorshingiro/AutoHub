const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const cars_routes = require('./routes/cars_routes');
const cleared_car_routes = require('./routes/cleared_car_routes');
const supplierRoutes = require('./routes/supplierRoutes');
const quotationRoutes = require('./routes/quotation_routes');
const purchaseRoute = require('./routes/purchaseRoute');
const stockItemRoute = require('./routes/stockItemRoute');
const userRoutes = require('./routes/userRoutes');

// Initialize the app
const app = express();
const PORT = process.env.PORT;

// Enable CORS
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api/vehicles', cars_routes);
app.use('/api/cleared/vehicles', cleared_car_routes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/quotations/vehicles', quotationRoutes);
app.use('/api/purchase', purchaseRoute);
app.use('/api/stock', stockItemRoute);
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests
        app.listen(PORT, () => console.log(`Connected to DB & listening on port ${PORT}`));
    })
    .catch(console.error);
