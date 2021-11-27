
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
io.sockets.on("connection", (socket) => {

  console.log("User "+socket.id+" connected to server");

  let roomId;
  let streamer;

  // Streamer Start a Streaming
  socket.on("start_streaming", (streamId) =>{
    socket.join(streamId);
    console.log(`User ${socket.id} start the streaming ${streamId}`);

    streamer = socket.id;
    roomId = streamId;
  });

  // Viewer Join a Streaming
  socket.on("join_streaming", (streamId) =>{
    socket.join(streamId);
    console.log(`User ${socket.id} joins the streaming ${streamId}`);

    socket.to(streamId).emit("viewer_joined", socket.id);
    roomId = streamId;
  });

  socket.on("offer", (viewerId, message) => {
    socket.to(viewerId).emit("offer", socket.id, message);
  });
  socket.on("answer", (streamerId, message) => {
    socket.to(streamerId).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  
  socket.on("write_comment", (data) => {
    socket.to(data.room).emit("receive_comment", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    
    if (streamer) {
      socket.to(roomId).emit("streamer_disconnected");
      console.log("User " + socket.id + " disconnected from streaming "+roomId);
    } else {
      socket.to(roomId).emit("disconnectPeer", socket.id);
      console.log("User " + socket.id + " disconnected from streaming "+roomId);
    }
  });
  socket.on("stop_streaming", (data) => {
    socket.to(data.room).emit("receive_comment", data);
    socket.to(data.room).emit("streamer_disconnected");
    socket.disconnect();
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
