var bundler    = require('./bundler')
  , twitter    = require('ntwitter')
  , twitterapi = require('./keys/twitterapi');

var t = new twitter(twitterapi.keys);

Array.prototype.compare = function(array) {
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
    e ? self.push({"name": e, "size": 1}) : '';
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

// Compares entities to Twitter stream, counts every match
exports.aggregator = function(callback) {
  bundler.initialize().then(function(masterlist) {
    // enter twitter firehouse
    t.stream('statuses/filter', { track: masterlist.keywords, language: 'en' }, function(stream){
      // analyze each tweet for presence of entities
      stream.on('data', function(tweet) {
        var tweetText = tweet.text.toLowerCase()
          , hashtags  = [];

        masterlist.children.forEach(function(entity) {
          console.log(entity.children)
          // if tweet contains an entity, increment count and grab hashtags
          if (tweetText.indexOf(entity.name.toLowerCase()) !== -1) {
            entity.mentions += 1;
            hashtags = tweetText.match(/#\S+/g);

            // if hashtags, increment old/add new hashtags; else, cull hashtags
            hashtags ? entity.children.compare(hashtags) : entity.children = entity.children.sort(descendingOrder).slice(0,7);

            callback(masterlist);
          }
        });
      });
    });
  });
};
