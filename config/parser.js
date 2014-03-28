var AlchemyAPI = require('./keys/alchemyapi')
  , async      = require('async')
  , newswire   = require('./newswire')
  , Promise    = require('bluebird');

var alchemyapi = new AlchemyAPI();

var masterlist = {
    "children": []
  , "keywords": []
  , "name"    : "newsfeed"
};

// fetchEntities turns nyt abstracts into entities (similar to keywords)
exports.fetchEntities = function() {
  return new Promise(function(resolve, reject) {

    // pullBreakingNews() returns a promise with the breaking news abstracts
    newswire.pullBreakingNews().then(function(abstracts) {

      async.each(abstracts, iterator, done);

      function iterator(item, callback) {
        masterlist.keywords = [];
        alchemyapi.entities('text', item, {}, function(response) {

          // add each entity to masterlist
          response.entities.forEach(function(entity) {
            masterlist.keywords.push(entity.text);
          });

          callback(null, masterlist);
        });
      };

      function done(err, results) {
        if (err) {
          console.log("ERROR: ", err);
        } else {
          console.log('Alchemy returned ' + masterlist.keywords.length + ' entities...');
          // when all the iterations have returned, send the promise.
          resolve(masterlist);
        }
      };

    });
  });
};
