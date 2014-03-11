var express = require('express')
  , app     = express()
  , http    = require('http')
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , cronJob = require('cron').CronJob
  , _       = require('underscore')
  , path    = require('path')
  , twitter = require('./twitter_firehose.js');


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

app.get('/', function(req, res) {
  res.render('index', { data: watchlist });
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
twitter.mergeNewsfeed().then(function(watchList) {
  io.sockets.emit('data', {'watchList': watchList});
  console.log("* * * updating socket with data * * *");
});





// =====================
// reset total every 24 hours
// new cronJob('0 0 0 * * *', function(){
//   watchList.total = 0;
//   _.each(watchKeywords, function(e) { watchList.symbols[e] = 0; });

//   // io.sockets.emit('data', watchList);
// }, null, true);
