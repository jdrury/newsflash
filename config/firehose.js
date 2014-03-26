var bundler    = require('./bundler')
  , twitter    = require('ntwitter')
  , twitterapi = require('./keys/twitterapi');

var t = new twitter(twitterapi.keys);

exports.aggregator = function(callback) {
  // Compares entities to Twitter stream, counts every match
  bundler.initialize().then(function(masterlist) {


    t.stream('statuses/filter', { track: masterlist.keywords, language: 'en' }, function(stream){
      // enter twitter firehouse

      stream.on('data', function(tweet) {
        // analyze each tweet for presence of entities
        var tweetText = tweet.text.toLowerCase()
          , hashtags  = [];

        masterlist.children.forEach(function(entity) {
          if (tweetText.indexOf(entity.name.toLowerCase()) !== -1) {
            // if tweet contains an entity, increment count and grab hashtags
            entity.mentions += 1;
            hashtags = tweetText.match(/#\S+/g);
            // grab any hashtags

            if (hashtags) {
              if (entity.children.length === 0 ) {
                // if the entity has no preexisting hashtags, initialize with one hashtag
                entity.children.push({"name": hashtags[0], "size": 1});
                callback(masterlist);

              } else {
                // otherwise, compare hashtags to preexisting and mark any duplicates
                entity.children.forEach(function(child) {
                  hashtags.forEach(function(hashtag) {
                    if (hashtag === child.name) {
                      // if hashtag is already present, increment size and set hashtag to false
                      child.size += 1;
                      hashtag = false;
                      console.log("NULL");
                    }
                  });
                });

                hashtags.forEach(function(hashtag) {
                  // add any hashtags not marked as pre-existing
                  if (hashtag) {
                    console.log("UNIQUE")
                    var newHashtag = {"name": hashtag, "size": 1};
                    entity.children.push(newHashtag);
                    callback(masterlist);
                  }
                });
              };
              // end if (hashtags)
            } else {
              // if no hashtags present
              entity.children = entity.children.slice(0,6);
              // every once and a while, cull the hashtags
              callback(masterlist);
            }
          }
        }); // end masterlist.children (forEach(entity))

      });
    });
  });
};
