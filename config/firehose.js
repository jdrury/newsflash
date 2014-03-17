var bundler    = require('./bundler')
  , twitter    = require('ntwitter')
  , twitterapi = require('./api/twitterapi');

var t = new twitter(twitterapi.keys);

// Compares entities to Twitter stream, counts every match
exports.aggregator = function(callback) {
  bundler.initialize().then(function(masterlist) {

    t.stream('statuses/filter', { track: masterlist.keywords }, function(stream) {

      // read twitter firehose for incoming tweets.
      stream.on('data', function(tweet) {
        var tweetText = tweet.text.toLowerCase();

        // sift through each tweet for presence of entities
        masterlist.children.forEach(function(parentObject) {

          // if the entity exists in the tweet, update counters
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
