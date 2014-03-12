var express = require('express')
  , app     = express()
  , http    = require('http')
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , cronJob = require('cron').CronJob
  , _       = require('underscore')
  , path    = require('path')
  , twitter = require('./twitter_firehose.js');
// export initialize

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(path.join(__dirname, 'components')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
watchlist = [];
app.get('/', function(req, res) {
  res.render('index', { data: twitter.initializeFeed() });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


io.sockets.on('connection', function(socket) {
  socket.on('data', function(watchList){
    io.sockets.emit('watchList', watchList);
  });
});

// pull down newsfeed and add it to socket.io
twitter.mergeNewsfeed(function(watchList) {
  io.sockets.emit('data', {'watchList': watchList});
  console.log("* * * updating socket with data * * *");

  // var count = 0;
  // for (var key in watchList.keywords) {
  //   if (watchList.keywords.hasOwnProperty(key)) {
  //     count += 1;
  //   }
  // }
  // console.log("[app.js]: watchList.keywords=", count);
});
