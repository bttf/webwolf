'use strict';
const shortid = require('shortid');
const fbClient = require('./firebaseClient');
let gameId;

module.exports = function(socket) {
  const id = socket.id;
  console.log('socket instantiated', socket.id);
  socket.on('register', (data) => {
    setUsername(id, data, socket);
  });
  socket.on('newGame', (username) => {
    createNewGame(id, username, socket);
  });
  socket.on('joinGame', (data) => {
    const gameId = data.gameId;
    const username = data.username;
    addPlayerToGame(id, gameId, username, socket);
  });
  socket.on('disconnect', function() {
    deleteUser(id);
  });
  return socket;
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
  if (gameId) {
    fbClient.child(`games/${gameId}/users/${id}`).remove();
  }
}

function createNewGame(id, username, socket) {
  gameId = shortid.generate();
  fbClient.child(`games/${gameId}/users/${id}`).set({
    name: username,
  }, function() {
    socket.emit('gameCreated', gameId);
  });
}

function addPlayerToGame(id, gameId, username, socket) {
  fbClient.child(`games/${gameId}/users/${id}`).set({
    name: username,
  }, function() {
    socket.emit('gameJoined', gameId);
  });
}
