var AlchemyAPI = require('./api/alchemyapi')
  , nytimes    = require('./newswire')
  , seed       = require('./db/seed')
  , Promise    = require('bluebird')
  , alchemyapi = new AlchemyAPI();

var masterlist = {
        "name": "newsfeed"
      , "size": 0
      , "mentions": 0
      , "children": []
      , "keywords": []
    };

exports.initialize = function() {
  return new Promise(function(resolve, reject) {
    nytimes.pullBreakingNews(function(newswire) {
      var abstracts = [];

      // pluck abstracts from each article in the newswire
      newswire.forEach(function(article) {
        abstracts.push(article.abstract);
      });

      // seed.fakeData(function(masterlist) {
      //   resolve(masterlist);
      // });

      console.log(abstracts);

      // fetch entities for each abstract
      abstracts.forEach(function(abstract) {
        // call the alchemy entities api
        alchemyapi.entities('text', abstract, {}, function(response) {
          // bundle each entity in the masterlist object
          console.log(response.entities.text);

          response.entities.forEach(function(entity) {

            masterlist.children[masterlist.size] = {"name": entity.text, "size": 0, "abstract": abstract, "children": []};
            masterlist.size += 1;
            masterlist.keywords.push(entity.text);

          });

          console.log("Alchemy returned " + masterlist.size + " entities.")
          resolve(masterlist);
        });
      });

    });
  });
};