var AlchemyAPI = require('./api/alchemyapi')
  , async      = require('async')
  , nytimes    = require('./newswire')
  , Promise    = require('bluebird');

var alchemyapi = new AlchemyAPI();

var masterlist = {
    "children": []
  , "keywords": []
  , "name"    : "newsfeed"
};


// initialize() returns a promise with the populated masterlist
exports.initialize = function() {
  return new Promise(function(resolve, reject) {

    // pullBreakingNews() returns a promise with the breaking news articles
    nytimes.pullBreakingNews().then(function(abstracts) {

      async.each(abstracts, iterator, done);

      function iterator(item, callback) {
        alchemyapi.entities('text', item, {}, function(response) {

          // initialize each entity with masterlist
          response.entities.forEach(function(entity) {
            masterlist.children.push({"name": entity.text, "children": []});
            masterlist.keywords.push(entity.text);
          });

          callback(null, masterlist);
        });
      };

      function done(err, results) {
        if (err) {
          console.log("ERROR: ", err);
        } else {
          console.log('Analyzing ' + abstracts.length + ' abstracts with Alchemy...');
          resolve(masterlist);
        }
      };

    });
  });
};
