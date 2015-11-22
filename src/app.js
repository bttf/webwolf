const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const engines = require('consolidate');
const router = require('./router');
const apiRouter = require('./apiRouter');
const socketHandler = require('./socketHandler');
const socketConnections = [];
const primeSocket = require('./socketPrimer');
const fbClient = require('./firebaseClient');

app.set('views', path.join(__dirname, 'webwolf-client/dist'));
app.set('view engine', 'html');
app.engine('html', engines.handlebars);
app.use(express.static(path.join(__dirname, 'webwolf-client/dist')));

app.use('/api', apiRouter);
app.use('/*', router);

io.on('connection', function(socket) {
  socketConnections.push(primeSocket(socket));
});

fbClient.child('games').on('child_added', (snapshot) => {
  const gameId = snapshot.key();

  console.log('NEWGAME', snapshot.key());

  fbClient.child(`games/${gameId}/users`).on('child_added', (snapshot) => {
    console.log(`GAME: ${gameId}; NEW USER`, snapshot.key(), snapshot.val());
  });

  fbClient.child(`games/${gameId}/users`).on('child_removed', (snapshot) => {
    console.log(`GAME: ${gameId}; USER REMOVED`, snapshot.key(), snapshot.val());
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
