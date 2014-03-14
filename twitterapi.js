var nytimes = require('./nytimesapi.js')
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

// Catches NYTimes Promise, applies keywords to watchList object and sets each to zero
exports.initializeFeed = function() {
  return new Promise(function(resolve, reject) {
    // catch all the keywords from alchemy Promise
    nytimes.getKeywords().then(function(keyterms) {
      // add the alchemy keywords to the watchKeywords array

      _.each(keyterms, function(keyterm) {
        watchKeywords.push(keyterm);
      });

      // initialize keywords at zero
      _.each(watchKeywords, function(e) { watchList.keywords[e] = 0; });

      resolve(watchList);
    });
  });
};

// Compares watchList (NYT Keywords) to Twitter stream, counts every mention
exports.keywordStream = function(callback) {
  exports.initializeFeed().then(function(watchList) {
    // var count = 0;
    // for (var key in watchList.keywords) {
    //   if (watchList.keywords.hasOwnProperty(key)) {
    //     count += 1;
    //   }
    // }
    // console.log("[twit]inner stream: watchList.keywords=", count);

    t.stream('statuses/filter', { track: watchKeywords }, function(stream) {
      // read twitter firehose ('data') for incoming tweets.
      stream.on('data', function(tweet) {
        var tweetText = tweet.text.toLowerCase();
        // compare the text of each tweet to each NYT keyword in the watchList
        _.each(watchKeywords, function(e) {
          // if the keyword exists in the tweet, += 1
          if (tweetText.indexOf(e.toLowerCase()) !== -1) {
            watchList.keywords[e] += 1;
            watchList.total += 1;
          }
          callback(watchList);
        });
      });
    });
  });
};
