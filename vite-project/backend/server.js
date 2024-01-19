const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;
const userRoutes = require('./routes/cars_routes');

//initialise the app
const app = express();

// Middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Routes
app.use('/api/users', userRoutes);

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests
        app.listen(port, () => console.log(`Connected to DB & listening on port ${port}`));
    })
    .catch(console.error);



