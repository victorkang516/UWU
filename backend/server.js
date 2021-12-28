
require('dotenv').config();

const express = require("express");
const connectDB = require("./config/db");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

connectDB();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Socket IO
io.sockets.on('connection', function (socket) {

  console.log("User " + socket.id + " connected to server");
  require('./sockets/streamingSocket')(socket);
  require('./sockets/normalStreamingSocket')(socket);
  require('./sockets/auctionStreamingSocket')(socket);

});


// Require Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require('./routes/shopRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const streamingRoutes = require('./routes/streamingRoutes');


// Use Routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/shops', shopRoutes);
app.use('/memberships', membershipRoutes);
app.use('/streamings', streamingRoutes);


const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
