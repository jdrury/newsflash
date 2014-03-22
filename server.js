var express  = require('express')
  , app      = express()
  , path     = require('path')
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server)
  , cronJob  = require('cron').CronJob
  , firehose = require('./config/firehose.js')
  , nytimes  = require('./config/newswire.js');

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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app/public')));

app.get('/', function(req, res) {
  res.render('index');
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// ==============

// socket.io config for Heroku
sockets.configure(function() {
  sockets.set('transports', ['xhr-polling']);
  sockets.set('polling duration', 10);
});

io.sockets.on('connection', function(socket) {
  // console.log("client connected");
});

firehose.aggregator(function(masterlist) {
  io.sockets.emit('update', {'masterlist': masterlist});
});
