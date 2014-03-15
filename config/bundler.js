var AlchemyAPI = require('./api/alchemyapi')
  , nytimes    = require('./newswire')
  , seed       = require('./db/seed')
  , Promise    = require('bluebird')
  , alchemyapi = new AlchemyAPI();

var masterlist = {
    "name"    : "newsfeed"
  , "size"    : 0
  , "mentions": 0
  , "children": []
  , "keywords": []
};

// initialize() returns a promise with the populated masterlist
exports.initialize = function() {
  return new Promise(function(resolve, reject) {

    // pullBreakingNews() returns a promise with the breaking news articles
    nytimes.pullBreakingNews().then(function(newswire) {
      var abstracts = [];

      // select the abstracts from each article in the newswire
      newswire.forEach(function(article) {
        abstracts.push(article.abstract);
      });

      // ** THIS WORKS **
      // seed.fakeData(function(masterlist) {
      //   resolve(masterlist);
      // });

      // find the entities in each abstract with alchemy API
      abstracts.forEach(function(abstract) {
        alchemyapi.entities('text', abstract, {}, function(response) {

          // initialize each entity with masterlist
          response.entities.forEach(function(entity) {
            masterlist.children[masterlist.children.length] = {"name": entity.text, "size": 0, "abstract": abstract, "children": []};
            masterlist.size += 1;
            masterlist.keywords.push(entity.text);
          });

          console.log("Alchemy returned " + masterlist.size + " entities from " + abstracts.length + " abstracts.");

          console.log(masterlist.size)
          resolve(masterlist);

        });
      });

      // resolve(masterlist) // => undefined

    });
  });
};
