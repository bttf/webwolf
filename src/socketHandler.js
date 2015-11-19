module.exports = function(socket) {
  console.log('a user has connected', socket.id);

  socket.on('register', (data) => {
    console.log('register', data, socket.id);
  });

  socket.on('disconnect', function() {
    console.log('user gone!');
  });
};
