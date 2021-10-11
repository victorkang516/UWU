
require('dotenv').config();

const express = require("express");
const connectDB = require("./config/db");

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');


connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routing
app.use('/products', productRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
