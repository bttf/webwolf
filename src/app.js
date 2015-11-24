const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const engines = require('consolidate');
const router = require('./router');
const socketMap = {};
const primeSocket = require('./socketPrimer');
const fbClient = require('./firebaseClient');
const _ = require('lodash');

app.set('views', path.join(__dirname, 'webwolf-client/dist'));
app.set('view engine', 'html');
app.engine('html', engines.handlebars);
app.use(express.static(path.join(__dirname, 'webwolf-client/dist')));

app.use('/*', router);

io.on('connection', function(socket) {
  socketMap[socket.id] = primeSocket(socket);
});

fbClient.child('games').on('child_added', (snapshot) => {
  const gameId = snapshot.key();
  fbClient.child(`games/${gameId}/users`).on('value', (snapshot) => {
    if (snapshot.val()) {
      const socketIds = Object.keys(snapshot.val());
      socketIds.forEach((id) => {
        if (socketMap[id]) {
          socketMap[id].emit('gameJoined', _.values(snapshot.val()));
        }
      });
    }
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
