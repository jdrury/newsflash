var nytimes = require('./nytimes_firehose.js')
  , twitter = require('ntwitter')
  , Promise = require('bluebird')
  , _       = require('underscore');

var watchKeywords = [];

var watchList = {
  total: 0,
  keywords: {}
};

var t = new twitter({
    consumer_key: 'djsET78GAcb6SemgYT6Xw'
  , consumer_secret: 'AWfNIZbUkcToO8ZVsKt5xeNFmKwjGmLHfLAqLiOqUg'
  , access_token_key: '322965911-17Rkt0lWekPQCQBiQYIpIS3SC63MqGZR2SSnXm3g'
  , access_token_secret: 'jvaf1cFPx1AFsmLdATVGl8zd7dTcsXVCR5mPuk4UoNR9u'
});

// Catches NYTimes Promise, applies keywords to watchList object and sets all counts to zero
exports.initializeFeed = function() {
  return new Promise(function(resolve, reject) {
    // catch final value from NYTimes Promise
    nytimes.getKeywords().then(function(keywords) {
      // add the NYT keywords to the watchKeywords array
      _.each(keywords, function(keyword) {
        watchKeywords.push(keyword);
      });

      // set every keyword value to zero
      _.each(watchKeywords, function(e) { watchList.keywords[e] = 0; });

      resolve(watchList);
    });
  });
};
// use event
// Compares watchList (NYT Keywords) to Twitter stream, counts every mention
exports.mergedNewsfeed = function(callback) {
    exports.initializeFeed().then(function(watchList) {
      var count = 0;
      for (var key in watchList.keywords) {
        if (watchList.keywords.hasOwnProperty(key)) {
          count += 1;
        }
      }

      console.log("[twit]inner stream: watchList.keywords=", count);

      t.stream('statuses/filter', { track: watchKeywords }, function(stream) {
        // read twitter firehose ('data') for incoming tweets.
        stream.on('data', function(tweet) {
          var text = tweet.text.toLowerCase();
          // compare the text of each tweet to each NYT keyword in the watchList
          _.each(watchKeywords, function(e) {
            // if the keyword exists in the tweet, += 1
            if (text.indexOf(e.toLowerCase()) !== -1) {
              watchList.keywords[e] += 1;
              watchList.total += 1;
            }
          });
          // streaming constantly here...
          // console.log(watchList);
          // ... but freezes in app.js once it gets resolved
          callback(watchList);
        });
      });
    });
};
