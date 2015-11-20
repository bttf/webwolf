const fbClient = require('./firebaseClient');

module.exports = function(socket) {
  const id = socket.id;
  console.log('a user has connected', socket.id);

  socket.on('register', (data) => {
    console.log('register', data, socket.id);
    setUsername(id, data, socket);
  });

  socket.on('disconnect', function() {
    console.log('user gone!');
  });
};

function setUsername(id, name, socket) {
  fbClient.child(`users/${id}`).set({
    name: name,
  }, function() {
    socket.emit('isRegistered');
  });
}
