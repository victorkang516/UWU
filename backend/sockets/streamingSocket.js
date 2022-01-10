exports = module.exports = function (socket) {

  let roomId;
  let streamer;

  socket.on("start_streaming", (streamId) => {
    socket.join(streamId);
    console.log(`User ${socket.id} start the streaming ${streamId}`);

    streamer = socket.id;
    roomId = streamId;
  });

  socket.on("join_streaming", (streamId) => {
    socket.join(streamId);
    console.log(`User ${socket.id} joins the streaming ${streamId}`);

    socket.to(streamId).emit("viewer_joined", socket.id);
    roomId = streamId;
  });

  socket.on("disconnect", () => {

    // if (streamer) {
    //   socket.to(roomId).emit("streamer_disconnected");
    //   console.log("User " + socket.id + " disconnected from streaming " + roomId);
    // } else {
    //   socket.to(roomId).emit("disconnectPeer", socket.id);
    //   console.log("User " + socket.id + " disconnected from streaming " + roomId);
    // }
  });
  
  socket.on("stop_streaming", (data) => {
    socket.to(data.room).emit("receive_comment", data);
    socket.to(data.room).emit("streamer_disconnected");
    //socket.disconnect();
  });

  // P2P Connections /////////////////////////////
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

}