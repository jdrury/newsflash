var bundler    = require('./bundler')
  , twitter    = require('ntwitter')
  , twitterapi = require('./keys/twitterapi');

var t = new twitter(twitterapi.keys);

// Compares entities to Twitter stream, counts every match
exports.aggregator = function(callback) {
  bundler.initialize().then(function(masterlist) {
    console.log(masterlist.keywords);
    // enter twitter firehouse
    t.stream('statuses/filter', { track: masterlist.keywords, language: 'en' }, function(stream){

      // analyze each tweet for presence of entities
      stream.on('data', function(tweet) {
        var tweetText = tweet.text.toLowerCase()
          , hashtags  = [];

        masterlist.children.forEach(function(entity) {
          // if tweet contains an entity, increment count and grab hashtags
          if (tweetText.indexOf(entity.name.toLowerCase()) !== -1) {
            entity.mentions += 1;
            // grab any hashtags
            hashtags = tweetText.match(/#\S+/g);

            if (hashtags) {
              // if the entity has no preexisting hashtags, add all hashtags
              if (entity.children.length === 0 ) {
                // hashtags.forEach(function(hashtag) {
                  entity.children.push({"name": hashtags[0], "size": 1});
                // });
              } else {
                // otherwise, compare new hashtags to preexisting hashtags and mark any duplicates
                entity.children.forEach(function(child, i) {
                  hashtags.forEach(function(hashtag, j) {
                    if (hashtag === child.name) {
                      child.size += 1;
                      hashtags[j] = false;

                      callback(masterlist);
                    }
                  });
                });
                // add any hashtags not marked as pre-existing
                hashtags.forEach(function(hashtag) {
                  if (hashtag) {
                    var newHashtag = {"name": hashtag, "size": 1};
                    entity.children.push(newHashtag);

                    callback(masterlist);
                  }
                });
              };

            } else {
              // every once and a while, cull the hashtags
              entity.children = entity.children.slice(0,6);

              callback(masterlist);
            }
          }
        }); // end masterlist.children (forEach(entity))

      });
    });
  });
};
