var AlchemyAPI = require('./keys/alchemyapi')
  , async      = require('async')
  , nytimes    = require('./newswire')
  , Promise    = require('bluebird');

var alchemyapi = new AlchemyAPI();

var masterlist = {
    "children": []
  , "keywords": []
  , "name"    : "newsfeed"
};

// getEntities returns all the entities found
function getEntities() {
  return new Promise(function(resolve, reject) {
    // pullBreakingNews() returns a promise with the breaking news articles
    nytimes.pullBreakingNews().then(function(abstracts) {

      async.each(abstracts, iterator, done);

      function iterator(item, callback) {
        masterlist.keywords = [];
        alchemyapi.entities('text', item, {}, function(response) {

          // initialize each entity with masterlist
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
          resolve(masterlist);
        }
      };

    });
  });
};

// initialize() returns initialized entities without duplicates
exports.initialize = function() {
  return new Promise(function(resolve, reject) {
    getEntities().then(function(masterlist) {
      console.log("INSIDE INITIALIZE")

      masterlist.keywords.sort();

      async.each(masterlist.keywords, iterator, done);

      function iterator(entity, callback) {
        console.log("INSIDE ITERATOR")
        var last;

        if (entity === "undefined") {
          masterlist.keywords.splice(i,1);
        } else if (entity !== last || i === 0) {
          // if entity valid and unique, initialize entity
          masterlist.children.push({"name": entity, "children": [], "mentions": 0});
        } else {
          // entity is a duplicate, remove it
          masterlist.keywords.splice(i,1);
          console.log('removed', entity)
        }
        last = entity;

        callback(null, masterlist);
      };

      function done(err, results) {
        if (err) {
          console.log("ERROR: ", err);
        } else {
          console.log('Final count: ' + masterlist.keywords.length + ' entities.');
          resolve(masterlist);
        }
      };

    });
  });
};

