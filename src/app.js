const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const engines = require('consolidate');
const router = require('./router');
const socketHandler = require('./socketHandler');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', engines.handlebars);

app.use(router);
io.on('connection', socketHandler);

http.listen(3000, () => {
  console.log('listening on *:3000');
});
