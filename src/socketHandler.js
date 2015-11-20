const fbClient = require('./firebaseClient');
const shortid = require('shortid');

module.exports = function(socket) {
  const id = socket.id;
  console.log('a user has connected', socket.id);

  socket.on('register', (data) => {
    console.log('register', data, socket.id);
    setUsername(id, data, socket);
  });

  socket.on('newGame', (username) => {
    console.log('new game', username);
    createNewGame(id, username, socket);
  });

  socket.on('joinGame', (data) => {
    const gameId = data.gameId;
    const username = data.username;
    addPlayerToGame(id, gameId, username, socket);
  });

  socket.on('disconnect', function() {
    console.log('user gone!');
    deleteUser(id);
  });
};

function setUsername(id, name, socket) {
  fbClient.child(`users/${id}`).set({
    name: name,
  }, function() {
    socket.emit('isRegistered', name);
  });
}

function deleteUser(id) {
  fbClient.child(`users/${id}`).remove();
}

function createNewGame(id, username, socket) {
  const gameId = shortid.generate();
  fbClient.child(`games/${gameId}/users/${id}`).set({
    name: username,
  }, function() {
    socket.emit('gameCreated', gameId);
    fbClient.child(`games/${gameId}/users`).on('value', (snapshot) => {
      socket.emit('gameJoined', snapshot.val());
    });
  });
}

function addPlayerToGame(id, gameId, username, socket) {
  fbClient.child(`games/${gameId}/users/${id}`).set({
    name: username,
  }, function() {
    fbClient.child(`games/${gameId}/users`).on('value', (snapshot) => {
      socket.emit('gameJoined', snapshot.val());
    });
  });
}
