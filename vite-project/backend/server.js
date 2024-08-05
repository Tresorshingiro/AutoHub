const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
//const socketIo = require('socket.io');
require('dotenv').config();
const PORT = process.env.PORT;
const path = require('path');
const cars_routes = require('./routes/cars_routes');
const cleared_car_routes = require('./routes/cleared_car_routes');
const supplierRoutes = require('./routes/supplierRoutes');
const quotationRoutes = require('./routes/quotation_routes');
const purchaseRoute = require('./routes/purchaseRoute');
const stockItemRoute = require('./routes/stockItemRoute');
const userRoutes = require('./routes/userRoutes');

//initialise the app
const app = express();
/*const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});*/

// Enbale CORS
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Routes
app.use('/api/vehicles', cars_routes);
app.use('/api/cleared/vehicles', cleared_car_routes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/quotations/vehicles', quotationRoutes);
app.use('/api/purchase', purchaseRoute);
app.use('/api/stock',stockItemRoute);
app.use('/api/users', userRoutes);

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests
        app.listen(PORT, () => console.log(`Connected to DB & listening on port ${PORT}`));
    })
    .catch(console.error);

// Socket.io connection
/*io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });*/

  
//module.exports = io;

// Operations is next

