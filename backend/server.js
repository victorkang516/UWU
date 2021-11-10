
require('dotenv').config();

const express = require("express");
const connectDB = require("./config/db");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Require Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require('./routes/shopRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const streamingRoutes = require('./routes/streamingRoutes');


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



// socket io (Streaming)
io.sockets.on("connection", socket => {


  socket.on("start_streaming", (data) =>{
    //console.log(io.sockets.adapter.rooms);
    socket.join(data);
    console.log(`User ${socket.id} start the video streaming ${data}`);
  });

  socket.on("join_streaming", (data) =>{
    //console.log(io.sockets.adapter.rooms);
    socket.join(data);
    console.log(`User ${socket.id} joins the video streaming ${data}`);
  });

  socket.on("write_comment", (data) => {
    socket.to(data.room).emit("receive_comment", data);
    console.log(data);
  })

  socket.on("stop_streaming", (data) => {
    socket.to(data.room).emit("receive_comment", data);
    socket.disconnect();
  })

  socket.on("disconnect", () => {
    console.log("A user Left");
  });
});


// Routing
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/shops', shopRoutes);
app.use('/memberships', membershipRoutes);
app.use('/streamings', streamingRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
