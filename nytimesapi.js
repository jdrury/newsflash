var http    = require('http')
  , Promise = require('bluebird')
  , AlchemyAPI = require('./alchemyapi');

var nytimes_key = '9f827b34ac633dc815206c8dab6ff00b:3:56570661';

var options = {
      host: "api.nytimes.com",
      path: "/svc/news/v3/content/all/all.json?&limit=50&api-key=" + nytimes_key
    };

var alchemyapi = new AlchemyAPI();


exports.pullBreakingNews = function(callback) {
  // establish connection with NYTimes API
  http.get(options, function(res) {
    var data = "";

    res.on('data', function(chunk) {
      data += chunk;
    });

    // save all the articles in the newswire
    res.on('end', function() {
      if (res.statusCode === 200) {
        var pretty = JSON.parse(data)
          , newswire = pretty.results;
      }

      console.log("Pulling down " + newswire.length + " articles from the NYTimes newswire...")

      callback(newswire);
    });
  });
};

exports.formatData = function() {
  return new Promise(function(resolve, reject) {
    exports.pullBreakingNews(function(newswire) {
      var abstracts = [];

      var masterlist = {
          "name": "newsfeed"
        , "size": 0
        , "mentions": 0
        , "children": []
        , "keywords": []
      };

      // pluck abstracts from each article in the newswire
      newswire.forEach(function(article) {
        abstracts.push(article.abstract);
      });

      // fetch entities for each abstract
      abstracts.forEach(function(abstract) {
        // call the alchemy entities api
        alchemyapi.entities('text', abstract, {}, function(response) {
          // package each entity in the masterlist object
          response.entities.forEach(function(entity) {
            masterlist.children[masterlist.size] = {"name": entity.text, "size": 0};
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