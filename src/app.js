const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const engines = require('consolidate');
const router = require('./router');
const apiRouter = require('./apiRouter');
const socketConnections = [];
const primeSocket = require('./socketPrimer');
const fbClient = require('./firebaseClient');
const _ = require('lodash');

app.set('views', path.join(__dirname, 'webwolf-client/dist'));
app.set('view engine', 'html');
app.engine('html', engines.handlebars);
app.use(express.static(path.join(__dirname, 'webwolf-client/dist')));

app.use('/api', apiRouter);
app.use('/*', router);

io.on('connection', function(socket) {
  socketConnections.push(primeSocket(socket));
});

// might have to chainge games child_added to on value?
fbClient.child('games').on('child_added', (snapshot) => {
  const gameId = snapshot.key();
  fbClient.child(`games/${gameId}/users`).on('value', (snapshot) => {
    const socketIds = _.pluck(socketConnections, 'id');
    const userIds = Object.keys(snapshot.val());
    const gameUserIds = _.intersection(socketIds, userIds);
    const applicableSockets = _.filter(socketConnections, function(socket) {
      return _.includes(gameUserIds, socket.id);
    });
    applicableSockets.forEach((socket) => {
      socket.emit('gameJoined', snapshot.val());
    });
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
