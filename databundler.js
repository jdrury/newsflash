var AlchemyAPI = require('./alchemyapi')
  , nytimes    = require('./nytimesapi')
  , Promise    = require('bluebird')
  , alchemyapi = new AlchemyAPI();

var masterlist = {
        "name": "newsfeed"
      , "size": 0
      , "mentions": 0
      , "children": []
      , "keywords": []
    };

exports.parse = function() {
  return new Promise(function(resolve, reject) {
    nytimes.pullBreakingNews(function(newswire) {
      var abstracts = [];

      // pluck abstracts from each article in the newswire
      newswire.forEach(function(article) {
        abstracts.push(article.abstract);
        console.log(article.headline)
      });

      // fetch entities for each abstract
      abstracts.forEach(function(abstract) {
        // call the alchemy entities api
        alchemyapi.entities('text', abstract, {}, function(response) {
          // package each entity in the masterlist object
          response.entities.forEach(function(entity) {
            masterlist.children[masterlist.size] = {"name": entity.text, "size": 0, "children": []};
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