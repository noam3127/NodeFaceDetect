
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  socketHandler = require('./socketHandler');


var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 4070);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorhandler());
}

// production only
if (env === 'production') {
  // TODO
}

/**
 * Routes
 */

// serve index and view partials
app.get('/', function(req, res) {
  res.send('public/index.html');
});

// JSON API

//app.use(api);

// redirect all others to the index (HTML5 history)
//app.get(routes.index);
var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
  //socket.emit('connected', {hi: 'connected'});
  console.log('connected');
  socketHandler(socket);
});

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
