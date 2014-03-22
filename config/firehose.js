var bundler    = require('./bundler')
  , twitter    = require('ntwitter')
  , twitterapi = require('./keys/twitterapi');

var t = new twitter(twitterapi.keys);

// Compares entities to Twitter stream, counts every match
exports.aggregator = function(callback) {
  bundler.initialize().then(function(masterlist) {
    t.stream('statuses/filter', { track: masterlist.keywords, language: 'en' }, function(stream){
      // read twitter firehose for incoming tweets.
      stream.on('data', function(tweet) {
        var tweetText = tweet.text.toLowerCase()
          , hashtags  = [];

        masterlist.children.forEach(function(entity) {
          if (tweetText.indexOf(entity.name.toLowerCase()) !== -1) {
            hashtags = tweetText.match(/#\S+/g);

            if (hashtags) {
              // ADD CURSE WORD FILTER
              // initialize an empty entity with a child
              if (entity.children.length === 0 ) {
                entity.children.push({"name": hashtags[0], "size": 1});
              } else {
                // check to see if the hashtag is already a child
                entity.children.forEach(function(child, i) {
                  hashtags.forEach(function(hashtag, j) {
                    if (hashtag === child.name) {
                      child.size += 1;
                      hashtags[j] = false;

                      callback(masterlist);
                    }
                  });
                });
                // add any hashtags which were never added
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
            } // end hashtags check
          }
        }); // end masterlist.children

      });
    });
  });
};
