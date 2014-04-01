var AlchemyAPI = require('../keys/alchemyapi')
  , async      = require('async')
  , nytimes    = require('./newswire')
  , Promise    = require('bluebird');

var alchemyapi = new AlchemyAPI();

// masterlist is an object to store D3 Treemap data
var masterlist = {
    "children": []
  , "name": "newsfeed"
  , "watchEntities": []
};

// fetch turns NYT abstracts into entities (similar to keywords)
exports.fetch = function() {
  return new Promise(function(resolve, reject) {

    // pullAbstracts() returns a promise with the breaking news abstracts
    nytimes.pullAbstracts().then(function(abstracts) {

      async.each(abstracts, iterator, done);

      function iterator(item, callback) {

        // use Alchemy API to get the entities out of each NYT abstract
        alchemyapi.entities('text', item, {}, function(response) {
          // add each entity returned by Alchemy to masterlist object
          console.log(response);
          response.entities.forEach(function(entity) {
            masterlist.watchEntities.push(entity.text);
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
          console.log('inside entities')
          resolve(masterlist);
        }
      };

    });
  });
};
