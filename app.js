var express = require('express')
  , app     = express()
  , http    = require('http')
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , twitter = require('ntwitter')
  , cronJob = require('cron').CronJob
  , _       = require('underscore')
  , path    = require('path');


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

// curl http://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=9f827b34ac633dc815206c8dab6ff00b:3:56570661 | underscore print -o store.js

var nytimes_key = '9f827b34ac633dc815206c8dab6ff00b:3:56570661'

var options = {
  host: "api.nytimes.com",
  path: "/svc/news/v3/content/all/all.json?api-key=" + nytimes_key
};

var findKeywords = function() {
http.get(options, function(res) {
  var news = ""
    , keywords
    , articleCollection = [];

  res.on('data', function(chunk) {
    news += chunk;
  });

  res.on('end', function() {
    if (res.statusCode == 200) {
      // news is an object with four properties
      // news.results is an array of objects
      var pretty_news = JSON.parse(news)
        , articles    = pretty_news.results;
    }

    articles.forEach(function(e,i) {
      // console.log(articles[i].title);
      articleCollection.push(articles[i].title.split(' '));
      keywords = articleCollection.concat.apply([], articleCollection);
      console.log(keywords)
    });
  });
});
}();

// console.log(nyt.keywords);

// input === NYT breaking news
// var watchKeywords = ['Russia', 'U.S.', 'Obama', 'Putin', 'Ukraine', 'Puppies', 'Food', 'Monday', 'sleep', 'daylight', 'work', 'jobs', 'hungry', 'SXSW', 'HBO', 'True Detective', 'Malaysia', 'crash', 'Paris', 'New York'];

// // Store total number of tweets received, store number of tweets received by keyword.
// var watchList = {
//     total: 0,
//     keywords: {}
// };

// // Initialize keywords at zero.
// _.each(watchKeywords, function(v) { watchList.keywords[v] = 0; });

// // Initialize Twitter API.
// var t = new twitter({
//     consumer_key: 'djsET78GAcb6SemgYT6Xw'
//   , consumer_secret: 'AWfNIZbUkcToO8ZVsKt5xeNFmKwjGmLHfLAqLiOqUg'
//   , access_token_key: '322965911-17Rkt0lWekPQCQBiQYIpIS3SC63MqGZR2SSnXm3g'
//   , access_token_secret: 'jvaf1cFPx1AFsmLdATVGl8zd7dTcsXVCR5mPuk4UoNR9u'
// });

// // Initialize socket.io
// io.sockets.on('connection', function(socket) {
//   console.log("* * * Client connected... * * *");
//   socket.emit('data', watchList);

//   // Filter Twitter firehouse by watchList[keywords]
//   t.stream('statuses/filter', { track: watchKeywords }, function(stream) {

//     // watch the firehouse ('data') event for incoming tweets.
//     stream.on('data', function(tweet) {

//       if (tweet.text !== undefined) {
//         var text = tweet.text.toLowerCase();
//         _.each(watchKeywords, function(v) {

//           // if the tweet matches a keyword
//           if (text.indexOf(v.toLowerCase()) !== -1) {
//             io.sockets.emit('data', watchList);
//             watchList.keywords[v] += 1;
//             watchList.total += 1;
//           }
//         });
//       }
//     });
//   });
// });

// new cronJob('0 0 0 * * *', function(){
//   watchList.total = 0;
//   _.each(watchKeywords, function(v) { watchList.symbols[v] = 0; });

//   io.sockets.emit('data', watchList);
// }, null, true);
