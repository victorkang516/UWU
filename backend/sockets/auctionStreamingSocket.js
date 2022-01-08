exports = module.exports = function (socket) {

  socket.on("start_auction", (data) => {
    socket.to(data.room).emit("auction_started", data);
    console.log(data);
  });

  socket.on("auction_next_round", (data) => {
    socket.to(data.room).emit("auction_next_round", data);
    console.log(data);
  });

  socket.on("auction_make_bid", (data) => {
    socket.to(data.room).emit("auction_make_bid", data);
    console.log(data);
  });

  socket.on("auction_new_highest_bid", (data) => {
    socket.to(data.room).emit("auction_new_highest_bid", data);
    console.log(data);
  });

  socket.on("end_auction", (data) => {
    socket.to(data.room).emit("auction_ended", data);
    console.log(data);
  });

}