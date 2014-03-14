var express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server)
  , cronJob  = require('cron').CronJob
  , _        = require('underscore')
  , path     = require('path')
  , firehose = require('./twitterapi.js');

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
    res.render('index');
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// ==============

io.sockets.on('connection', function(socket) {
  // console.log("client connected");
});

var watchList = null;
firehose.keywordStream(function(watchList) {
  // STREAMING . . .
  // watchList = wl;
  io.sockets.emit('watchUpdate', {'watchList': watchList});

});

setInterval(function() {
  // io.sockets.emit('watchUpdate', {'watchList': watchList});
}, 1000/60);