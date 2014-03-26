var http        = require('http')
  , newswireKey = require('./keys/nytimesapi')
  , Promise     = require('bluebird');

exports.pullBreakingNews = function() {
  // pullBreakingNews() returns a promise with breaking news articles
  return new Promise(function(resolve,reject) {

    http.get(newswireKey.options, function(res) {
      // establish connection with NYTimes API
      var data      = ""
        , abstracts = []
        , articles  = [];

      res.on('data', function(chunk) {
        data += chunk;
      });

      res.on('end', function() {
        // read all the articles in the newswire
        if (res.statusCode === 200) {
          var pretty = JSON.parse(data)
            , newswire = pretty.results;
        }

        console.log("Pulling down " + newswire.length + " articles from the NYTimes newswire...")

        newswire.forEach(function(article) {
          // dummy function that stores meta data about the newswire pull. not in use.
          abstracts.push(article.abstract);
          articles.push({
              "headline" : article.title
            , "abstract" : article.abstract
            , "URL"      : article.url
          });
        });

        resolve(abstracts);
      });
    });
  });
};
