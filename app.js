var express  = require('express')
  , app      = express()
  , path     = require('path')
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server)
  , cronJob  = require('cron').CronJob
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

firehose.matches(function(masterlist) {
  console.log("streaming")
  io.sockets.emit('update', {'masterlist': masterlist});
});
