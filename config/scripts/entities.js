var AlchemyAPI = require('../keys/alchemyapi')
  , async      = require('async')
  , nytimes    = require('./newswire')
  , Promise    = require('bluebird');

var alchemyapi = new AlchemyAPI();

// masterlist is an object to store D3 Treemap data
masterlist = {
    "children": []
  , "name": "newsfeed"
  , "watchEntities": []
};

// fetch turns NYT abstracts into entities (similar to keywords)
exports.fetch = function() {
  return new Promise(function(resolve, reject) {

    // pullAbstracts() returns a promise with the breaking news abstracts
    nytimes.pullAbstracts().then(function(articles) {

      masterlist.watchEntities = [];

      async.each(articles, iterator, done);

      function iterator(article, callback) {

        // use Alchemy API to get the entities out of each NYT abstract
        alchemyapi.entities('text', article[0], {}, function(response) {

          // add each entity returned by Alchemy to masterlist object
          response.entities.forEach(function(entity) {
            console.log("inside entity: " + article[1]);
            masterlist.watchEntities.push([entity.text, {"name": entity.text, "headline": article[1], "abstract": article[0], "url": article[2]}]);
            console.log({"name": entity.text, "headline": article[1], "abstract": article[0], "url": article[2]})
          });

          callback(null, masterlist);
        });
      };

      function done(err, results) {
        if (err) {
          console.log("ERROR: ", err);
        } else {
          console.log('Alchemy returned ' + masterlist.watchEntities.length + ' entities...');
          // when all the iterations have returned, send the promise.

          resolve(masterlist);
        }
      };
    });
  });
};
