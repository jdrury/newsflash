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

exports.initialize = function() {
  return new Promise(function(resolve, reject) {
    nytimes.pullBreakingNews(function(newswire) {
      var abstracts = [];

      // pluck abstracts from each article in the newswire
      newswire.forEach(function(article) {
        abstracts.push(article.abstract);
      });

      console.log(abstracts.length);

      seed.fakeData(function(masterlist) {
        resolve(masterlist);
      });


      // // fetch entities for each abstract
      // abstracts.forEach(function(abstract) {
      //   // call the alchemy entities api
      //   alchemyapi.entities('text', abstract, {}, function(response) {
      //     // bundle each entity as a parent in the masterlist object
      //     response.entities.forEach(function(entity, i) {

      //         console.log("response.entities #",i,"=", entity.text);

      //         masterlist.children[masterlist.children.length] = {"name": entity.text, "size": 0, "abstract": abstract, "children": []};
      //         masterlist.size += 1;
      //         console.log("size=",masterlist.size);

      //         masterlist.keywords.push(entity.text);

      //     });
      //     console.log("Alchemy returned " + masterlist.size + " entities from" + abstracts.length + " abstracts.");

      //     resolve(masterlist);
      //   });
      // });


    });
  });
};