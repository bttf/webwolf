'use strict';
const shortid = require('shortid');
const fbClient = require('./firebaseClient');

module.exports = function(socket) {
  let gameId;
  const id = socket.id;

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
    console.log('joining game', gameId, username)
    fbClient.child(`games/${gameId}/users/${id}`).set({
      name: username,
    });
  });

  socket.on('disconnect', function() {
    console.log('somebody closed this shit', id);
    fbClient.child(`users/${id}`).remove();
    if (gameId) {
      fbClient.child(`games/${gameId}/users/${id}`).remove();
    }
  });

  socket.on('assumeModerator', function() {
    fbClient.child(`games/${gameId}/users/${id}`).update({
      isModerator: true,
    });
  });

  return socket;
};
