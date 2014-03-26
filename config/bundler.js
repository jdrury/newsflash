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


function getEntities() {
  // getEntities returns a promise with all the entities
  return new Promise(function(resolve, reject) {

    nytimes.pullBreakingNews().then(function(abstracts) {
      // pullBreakingNews() returns a promise with the breaking news abstracts

      async.each(abstracts, iterator, done);

      function iterator(item, callback) {
        masterlist.keywords = [];
        alchemyapi.entities('text', item, {}, function(response) {


          response.entities.forEach(function(entity) {
            // add each entity to masterlist
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


exports.initialize = function() {
  // initialize() removes duplicate entities and initializes remainders
  return new Promise(function(resolve, reject) {
    getEntities().then(function(masterlist) {

      masterlist.keywords.sort();
      // sort the keywords so we save time in duplicate search

      async.each(masterlist.keywords, iterator, done);

      function iterator(entity, callback) {
        var last;

        if (entity === "undefined") {
          // if the entity is undefined , remove it
          console.log('undefined');
          masterlist.keywords.splice(i,1);
        } else if (entity !== last || i === 0) {
          // if entity is first in the list or it is not the same as the last entity
          masterlist.children.push({"name": entity, "children": [], "mentions": 0});
        } else {
          // entity is a duplicate, remove it
          console.log('duplicate entity');
          masterlist.keywords.splice(i,1);
        }

        last = entity;
        // set current entity to last before next iteration
        callback(null, masterlist);
      };

      function done(err, results) {
        if (err) {
          console.log("ERROR: ", err);
        } else {
          console.log('Initializing with ' + masterlist.keywords.length + ' entities.');
          resolve(masterlist);
        }
      };

    });
  });
};

