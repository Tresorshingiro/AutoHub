const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT;
const cars_routes = require('./routes/cars_routes');
const cleared_car_routes = require('./routes/cleared_car_routes');
const supplierRoutes = require('./routes/supplierRoutes');
const quotationRoutes = require('./routes/quotation_routes');
const purchaseRoute = require('./routes/purchaseRoute');
const stockRoute = require('./routes/stockRoute');
const userRoutes = require('./routes/userRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const incomeRoutes = require('./routes/incomeRoutes')
const expenseRoutes = require('./routes/expenseRoutes')

//initialise the app
const app = express();

// Enbale CORS
app.use(cors());

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Routes
app.use('/api/vehicles', cars_routes);
app.use('/api/cleared/vehicles', cleared_car_routes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/quotations/vehicles', quotationRoutes);
app.use('/api/purchase', purchaseRoute);
app.use('/api/stock',stockRoute);
app.use('/api/users', userRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes)

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests
        app.listen(PORT, () => console.log(`Connected to DB & listening on port ${PORT}`));
    })
    .catch(console.error);

// Operations is next

