const shortid = require('shortid');
const fbClient = require('./firebaseClient');

module.exports = function(socket) {
  "use strict";
  let gameId;
  const id = socket.id;

  socket.on('register', (username) => {
    const userObj = { id, username };
    fbClient.child(`users/${id}`).set(userObj, () => {
      socket.emit('isRegistered', userObj);
    });
  });

  socket.on('newGame', (user) => {
    gameId = shortid.generate();
    fbClient.child(`games/${gameId}/users/${id}`).set(user, () => {
      socket.emit('gameCreated', gameId);
    });
  });

  socket.on('joinGame', (data) => {
    gameId = data.gameId;
    const user = data.user;
    console.log('joining game', gameId, user);
    fbClient.child(`games/${gameId}/users/${id}`).set(user);
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
    }, () => {
      socket.emit('moderatorAssigned');
    });
  });

  return socket;
};
