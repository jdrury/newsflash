var entities = require('./entities');
var twitter = require('ntwitter');
var twitterapi = require('../keys/twitterapi');

var t = new twitter(twitterapi.keys);

Array.prototype.dupeBuster = function(array) {
  var self = this;
  for (var i = 0; i < this.length; i++) {
    for (var j = 0; j < array.length; j++) {
      if (this[i].name === array[j]) {
        this[i].size += 1;
        array[j] = null;
      }
    }
  }
  array.filter(function(e) {
    e ? self.push({'name': e, 'size': 1}) : '';
  });
}

function descendingOrder(a,b) {
  if (a.size < b.size) {
    return 1;
  }
  if (a.size > b.size) {
    return -1;
  }
  return 0;
}

// matchFinder() compares entities to tweets, counts every match
exports.matchFinder = function(callback) {

  // entities() returns an object ready to be added to a D3 treemap
  entities.fetch().then(function(masterlist) {

    console.log('* * * * * * *');
    console.log('firehose.js');
    console.log('* * * * * * *');
    console.log('');
    console.log(masterlist.watchEntities);
    console.log('');
    console.log(masterlist.children);
    console.log('');

    // enter twitter firehouse
    t.stream('statuses/filter', { track: masterlist.watchEntities, language: 'en' }, function(stream){

      // analyze each tweet for presence of entities
      stream.on('data', function(tweet) {
        var tweetText = tweet.text.toLowerCase();
        var hashtags  = [];

        // scan tweet for every entity in every article
        masterlist.children.forEach(function(article) {
          article.children.forEach(function(entity) {
            // if tweet contains an entity, increment entity and save hashtags
            if (tweetText.indexOf(entity.name.toLowerCase()) !== -1) {
              masterlist.size += 1;
              article.size += 1;
              entity.size += 1;
              hashtags = tweetText.match(/#\S+/g);

              if (hashtags) {
                // increment entity.child if match; insert hashtag if no match
                entity.children.dupeBuster(hashtags);

              } else {
                // if no hashtags, sort and trim existing children
                entity.children = entity.children.sort(descendingOrder).slice(0,3);
              }

              callback(masterlist);
            }
          });
        });
      });
    });
  });
};
