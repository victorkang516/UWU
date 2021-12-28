exports = module.exports = function (socket) {

  socket.on('file1Event', function () {
    console.log('file1Event triggered');
  });

}