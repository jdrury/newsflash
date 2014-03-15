var data = require('./databundler.js')
  , twitter = require('ntwitter')
  , Promise = require('bluebird');

var t = new twitter({
    consumer_key: 'djsET78GAcb6SemgYT6Xw'
  , consumer_secret: 'AWfNIZbUkcToO8ZVsKt5xeNFmKwjGmLHfLAqLiOqUg'
  , access_token_key: '322965911-17Rkt0lWekPQCQBiQYIpIS3SC63MqGZR2SSnXm3g'
  , access_token_secret: 'jvaf1cFPx1AFsmLdATVGl8zd7dTcsXVCR5mPuk4UoNR9u'
});

// Compares entities to Twitter stream, counts every match
exports.matches = function(callback) {
  data.initialize().then(function(masterlist) {
    t.stream('statuses/filter', { track: masterlist.keywords }, function(stream) {

      // read twitter firehose ('data') for incoming tweets.
      stream.on('data', function(tweet) {
        var tweetText = tweet.text.toLowerCase();
        // sift through each tweet for presence of entities
        masterlist.children.forEach(function(parentObject) {
          // if the keyword exists in the tweet, update counters
          if (tweetText.indexOf(parentObject.name.toLowerCase()) !== -1) {
            parentObject.size += 1;
            masterlist.mentions += 1;
            callback(masterlist);
          }
        });
      });
    });
  });
};
