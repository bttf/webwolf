const app = require('express')();
const http = require('http').Server(app);
const path = require('path');
const engines = require('consolidate');
const router = require('./router');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', engines.handlebars);

app.use(router);

http.listen(3000, () => {
  console.log('listening on *:3000 test');
});
