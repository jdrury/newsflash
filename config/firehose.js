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
        var tweetText = tweet.text;

        // sift through each tweet for presence of entities
        masterlist.children.forEach(function(entity) {
          var hashtags = [];
          // if the tweet has an entity
          if (tweetText.toLowerCase().indexOf(entity.name.toLowerCase()) !== -1) {
            // update counters
            // masterlist.mentions += 1;

            // catch all hashtags from matching tweet
            hashtags = tweetText.match(/#\S+/g);

            // if hashtags exist, save hashtags as children of entity
            if (hashtags) {
              console.log("HASHTAGS PRESENT");

              // if entity doesn't have any children, add hashtags automatically
              if (entity.children.length === 0) {
                hashtags.forEach(function(hashtag) {
                  entity.children.push({"name": hashtag, "size": 1})
                });
              } else {
                // entity.children = pre-existing hashtags
                entity.children.forEach(function(child, i) {
                  // hashtags = new hashtags from matching tweet
                  hashtags.forEach(function(hashtag) {

                    if (child.name.toLowerCase() === hashtag.toLowerCase()) {
                      // if the entity already has the hashtag, increment count
                      child.size += 1;

                      entity.children = entity.children.sort().slice(0,9);
                      callback(masterlist);
                    } else {
                      // otherwise add the new hashtag
                      newHashtag = {"name": hashtag, "size": 1};
                      entity.children.push(newHashtag);

                      entity.children = entity.children.sort().slice(0,9);
                      callback(masterlist);
                    }
                  });
                });
              }

            } else {

            callback(masterlist);
            }
          }

        });
      });
    });
  });
};
