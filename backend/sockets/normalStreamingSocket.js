exports = module.exports = function (socket) {

  socket.on("start_sale", (data) => {
    socket.to(data.room).emit("sale_started", data);
    console.log(data);
  });

  socket.on("end_sale", (data) => {
    socket.to(data.room).emit("sale_ended", data);
    console.log(data);
  });

}