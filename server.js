var express  = require('express')
  , app      = express()
  , path     = require('path')
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server)
  , firehose = require('./config/scripts/firehose.js');

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.errorHandler());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
// app.use(app.router);
app.use(express.static(path.join(__dirname, 'app/public')));

app.get('/', function(req, res) {
  firehose.matchFinder(function(masterlist) {
    res.render('index', {'masterlist': masterlist});
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// ==============

// socket.io config for Heroku
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function() {
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);
});

io.sockets.on('connection', function(socket) {
  // console.log("client connected");
});

firehose.matchFinder(function(masterlist) {
  io.sockets.emit('update', {'masterlist': masterlist});
});
