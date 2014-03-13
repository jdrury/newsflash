var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , cronJob = require('cron').CronJob
  , _       = require('underscore')
  , path    = require('path')
  , twithose = require('./twitter_firehose.js');

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/components', express.static(path.join(__dirname, 'components')));

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

twithose.mergedNewsfeed(function(watchList) {
  // STREAMING . . .
  io.sockets.emit('data', {'watchList': watchList});
});

io.sockets.on('connection', function(socket) {
  // listens for data event from the server side
  socket.on('data', function(watchList) {
    // forward data event to client
    socket.emit('watchList', {'watchList': watchList});
  });
});

// var AlchemyAPI = require('./alchemyapi');
// var alchemyapi = new AlchemyAPI();

// twithose.mergedNewsfeed(function(watchList) {
  // var myText = "Whoa, AlchemyAPI's Node.js SDK is really great, I can't wait to build my app!";
  // alchemyapi.keywords("text", text, {}, function(response) {
  //   console.log("Sentiment: " + response["docSentiment"]["type"]);
  // });
// });
