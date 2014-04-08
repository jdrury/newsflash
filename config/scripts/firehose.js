var entities = require('./entities');
var twitter = require('ntwitter');
var twitterapi = require('../keys/twitterapi');

var t = new twitter(twitterapi.keys);

Array.prototype.dupeBuster = function(hashtags) {
  var self = this;
  for (var i = 0; i < this.length; i++) {
    for (var j = 0; j < hashtags.length; j++) {
      if (hashtags[j] === 'pussy' || hashtags[j] === 'nigger' || hashtags[j] === 'nigga' || hashtags[j] === 'fuck' || hashtags[j] === 'bitch' || hashtags[j] === 'cunt') {
        hashtags[j] = null;
      } else if (this[i].name === hashtags[j]) {
        this[i].size += 1;
        hashtags[j] = null;
      }
    }
  }
  hashtags.filter(function(e) {
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
      var round = 0;

      // analyze each tweet for presence of entities
      stream.on('data', function(tweet) {
        var tweetText = tweet.text.toLowerCase();
        var hashtags  = [];
        var count = 0;
        var temp = {
          children: []
        };
        round += 1;

        // scan tweet for every entity in every article
        masterlist.children.forEach(function(article) {
          article.children.forEach(function(entity) {
            count += 1;
            // if tweet contains an entity, increment entity and save hashtags
            if (tweetText.indexOf(entity.name.toLowerCase()) !== -1) {
              masterlist.size += 1;
              article.size += 1;
              entity.size += 1;
              hashtags = tweetText.match(/#\S+/g);

              if (!hashtags) {
                return;
              }

              // this IF statement allows us to count unpopular hashtags
              if (count < 100) {
                // increment existing if hashtags match; add hashtags if no match
                temp.children.dupeBuster(hashtags);
                // publish top 3 hashtags, save the rest in temp array
                entity.children = temp.children.sort(descendingOrder).slice(0,2)

              } else {
                // every 100+ matches, save top 3 hashtags and delete remainder
                temp.children.dupeBuster(hashtags);
                entity.children = temp.children.sort(descendingOrder).slice(0,2);
                // reset to give new hashtags a chance to climb the rankings
                temp.children = entity.children;
                entity.children[0].size = entity.children[1].size = entity.children[2].size = 3;
                count = 0;
              }

              callback(masterlist);
            }
          });
        });
      });
    });
  });
};
