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
        masterlist.children.forEach(function(child) {

          // if the entity exists in the tweet, update counters
          if (tweetText.indexOf(child.name.toLowerCase()) !== -1) {
            child.size += 1;
            masterlist.total += 1;
            callback(masterlist);
          }

        });
      });
    });
  });
};
