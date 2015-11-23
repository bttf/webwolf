'use strict';
const shortid = require('shortid');
const fbClient = require('./firebaseClient');

/**
 * Handle socket events:
 *  - register: create user
 *  - newGame: create game and add user to it
 *  - joinGame: add user to existing game
 *  - disconnect: remove user from game and user itself
 *
 * @param socket
 * @return socket
 */
module.exports = function(socket) {
  let gameId;
  const id = socket.id;
  console.log('socket instantiated', socket.id);

  socket.on('register', (username) => {
    fbClient.child(`users/${id}`).set({
      username: username,
    }, function() {
      socket.emit('isRegistered', username);
    });
  });

  socket.on('newGame', (username) => {
    gameId = shortid.generate();
    fbClient.child(`games/${gameId}/users/${id}`).set({
      name: username,
    }, function() {
      socket.emit('gameCreated', gameId);
    });
  });

  socket.on('joinGame', (data) => {
    gameId = data.gameId;
    const username = data.username;
    fbClient.child(`games/${gameId}/users/${id}`).set({
      name: username,
    });
  });

  socket.on('disconnect', function() {
    fbClient.child(`users/${id}`).remove();
    if (gameId) {
      fbClient.child(`games/${gameId}/users/${id}`).remove();
    }
  });

  return socket;
};
