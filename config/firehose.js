var bundler    = require('./bundler')
  , twitter    = require('ntwitter')
  , twitterapi = require('./api/twitterapi');

var t = new twitter({
      consumer_key: 'djsET78GAcb6SemgYT6Xw'
  , consumer_secret: 'AWfNIZbUkcToO8ZVsKt5xeNFmKwjGmLHfLAqLiOqUg'
  , access_token_key: '322965911-17Rkt0lWekPQCQBiQYIpIS3SC63MqGZR2SSnXm3g'
  , access_token_secret: 'jvaf1cFPx1AFsmLdATVGl8zd7dTcsXVCR5mPuk4UoNR9u'
});

// Compares entities to Twitter stream, counts every match
exports.aggregator = function(callback) {
  bundler.initialize().then(function(masterlist) {

    t.stream('statuses/filter', { track: masterlist.keywords }, function(stream) {

      // stream.on("error", function())
      // read twitter firehose for incoming tweets.
      stream.on('data', function(tweet) {
        var tweetText = tweet.text.toLowerCase();

        // sift through each tweet for presence of entities
        masterlist.children.forEach(function(parentObject) {

          // if the entity exists in the tweet, update counters
          if (tweetText.indexOf(parentObject.name.toLowerCase()) !== -1) {
            parentObject.size += 1;
            masterlist.mentions += 1;
            console.log(masterlist);
            callback(masterlist);
          }

        });
      });
    });
  });
};
