var twitter = require('ntwitter')
  , nytimes = require('./nytimes_firehose.js')
  , Promise = require('bluebird')
  , _       = require('underscore')
  , watchKeywords = []
  , watchList     = {
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
      // initialize every keyword at count zero (0)
      _.each(watchKeywords, function(e) { watchList.keywords[e] = 0; });
      // return the initialized watchList
      resolve(watchList);
    });
  });
};

// finished product
// initializeFeed().then(function(watchList) {
//   console.log(watchList)
// });

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
                // console.log(watchList);
                // resolve(watchList);
              }
            });
            // console.log(watchList);
            // resolve(watchList);
          }
        // console.log(watchList);
        resolve(watchList);
        });
      });
    });
  });
};


// ***************
// This works, but it doesn't export
// Possibly because it is a promise inside a promise?
// ***************

// exports.newsfeed = function() {
//   return new Promise(function(resolve, reject) {
    // nytimes.getKeywords().then(function(keywords) {
    //   // add nytimes words to keywords
    //   _.each(keywords, function(keyword) {
    //     watchKeywords.push(keyword);
    //   });

      // initialize values at zero
      // _.each(watchKeywords, function(e) { watchList.keywords[e] = 0; });

    // // push nytimes keywords into twitter firehouse
    // t.stream('statuses/filter', { track: watchKeywords }, function(stream) {

    //   // read twitter firehouse ('data') for incoming tweets.
    //   stream.on('data', function(tweet) {

    //     // if the tweet exists, make it lowercase
    //     if (tweet.text !== undefined) {
    //       var text = tweet.text.toLowerCase();
    //       _.each(watchKeywords, function(e) {

    //         // if the keyword is present in the tweet, += 1
    //         if (text.indexOf(e.toLowerCase()) !== -1) {
    //           watchList.keywords[e] += 1;
    //           watchList.total += 1;
    //         }

    //       });
    //     }
    //     resolve(watchList);
    //     console.log(resolve(watchList));
    //   });
    // });
//   });
// }