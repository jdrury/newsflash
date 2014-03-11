var express = require('express')
  , app     = express()
  , http    = require('http')
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , twitter = require('ntwitter')
  , cronJob = require('cron').CronJob
  , _       = require('underscore')
  , path    = require('path')
  , nytimes = require('./nytimes_firehose.js');


app.set('port', process.env.PORT || 3000);
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
  res.render('index', { data: watchList });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// =====================

var watchKeywords = [];

var watchList     = {
      total: 0,
      keywords: {}
    };

var t = new twitter({
    consumer_key: 'djsET78GAcb6SemgYT6Xw'
  , consumer_secret: 'AWfNIZbUkcToO8ZVsKt5xeNFmKwjGmLHfLAqLiOqUg'
  , access_token_key: '322965911-17Rkt0lWekPQCQBiQYIpIS3SC63MqGZR2SSnXm3g'
  , access_token_secret: 'jvaf1cFPx1AFsmLdATVGl8zd7dTcsXVCR5mPuk4UoNR9u'
});

nytimes.getKeywords().then(function(keywords) {
  _.each(keywords, function(keyword) {
    watchKeywords.push(keyword);
  });

  _.each(watchKeywords, function(e) { watchList.keywords[e] = 0; });

  io.sockets.on('connection', function(socket) {
    console.log("* * * Client connected... * * *");
    socket.emit('data', watchList);

    // Filter Twitter firehouse by watchList[keywords]
    t.stream('statuses/filter', { track: watchKeywords }, function(stream) {

      // watch the firehouse ('data') event for incoming tweets.
      stream.on('data', function(tweet) {

        if (tweet.text !== undefined) {
          var text = tweet.text.toLowerCase();
          _.each(watchKeywords, function(e) {

            // if the tweet matches a keyword
            if (text.indexOf(e.toLowerCase()) !== -1) {
              io.sockets.emit('data', watchList);
              watchList.keywords[e] += 1;
              watchList.total += 1;
            }
          });
        }
      });
    });
  });
});

// new cronJob('0 0 0 * * *', function(){
//   watchList.total = 0;
//   _.each(watchKeywords, function(e) { watchList.symbols[e] = 0; });

//   io.sockets.emit('data', watchList);
// }, null, true);
