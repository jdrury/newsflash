var twitter = require('ntwitter')
  , nytimes = require('./nytimes_firehose.js')
  , Promise = require('bluebird')
  , _       = require('underscore');

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

var initializeFeed = function() {
  return new Promise(function(resolve, reject) {
    nytimes.getKeywords().then(function(keywords) {
      // add nytimes keywords to the watchList
      _.each(keywords, function(keyword) {
        watchKeywords.push(keyword);
      });
      // set every keyword value to zero
      _.each(watchKeywords, function(e) { watchList.keywords[e] = 0; });
      // return the initialized watchList
      resolve(watchList);
    });
  });
};

exports.mergeNewsfeed = function() {
  return new Promise(function(resolve, reject) {
    initializeFeed().then(function(watchList) {
      t.stream('statuses/filter', { track: watchKeywords }, function(stream) {
        // read twitter firehose ('data') for incoming tweets.
        stream.on('data', function(tweet) {
          // if the tweet exists, make it lowercase
          if (tweet.text !== undefined) {
            // console.log('hey')
            var text = tweet.text.toLowerCase();
            _.each(watchKeywords, function(e) {
              // if the keyword is present in the tweet, += 1
              if (text.indexOf(e.toLowerCase()) !== -1) {
                watchList.keywords[e] += 1;
                watchList.total += 1;
              }
              resolve(watchList);
            });
          }
        });
      });
    });
  });
};
