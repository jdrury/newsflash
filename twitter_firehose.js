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

// Catches NYTimes Promise, applies keywords to new array and sets all counts to zero
var initializeFeed = function() {
  return new Promise(function(resolve, reject) {
    // catch final value from NYTimes Promise
    nytimes.getKeywords().then(function(keywords) {
      // ??? why is 'keywords' === article.title.split(' ')? 'keywords' should equal all titles
      console.log("++Keywords is " + keywords.length + " words long in twitter_firehose.js++")
      // add the NYT keywords to the watchKeywords array
      _.each(keywords, function(keyword) {
        watchKeywords.push(keyword);
      });

      console.log(watchKeywords);
      // set every keyword value to zero
      _.each(watchKeywords, function(e) { watchList.keywords[e] = 0; });

      // return the initialized watchList
      // ??? why
      console.log(watchList)
      resolve(watchList);
    });
  });
};

// Catches Initialize Promise, counts every time a NYTimes keyword is mentioned on Twitter
exports.mergeNewsfeed = function() {
  return new Promise(function(resolve, reject) {
    initializeFeed().then(function(watchList) {
      t.stream('statuses/filter', { track: watchKeywords }, function(stream) {
        // read twitter firehose ('data') for incoming tweets.
        stream.on('data', function(tweet) {
          // if the tweet exists, make it lowercase
          // if (tweet.text !== undefined) {
            var text = tweet.text.toLowerCase();
            _.each(watchKeywords, function(e) {
              // if the keyword is present in the tweet, += 1
              if (text.indexOf(e.toLowerCase()) !== -1) {
                watchList.keywords[e] += 1;
                watchList.total += 1;
              }
              resolve(watchList);
            });
          // }
        });
      });
    });
  });
};
