
require('dotenv').config();

const express = require("express");
const connectDB = require("./config/db");

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');


connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routing
app.use('/products', productRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
