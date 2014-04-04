var http = require('http');
var nytimesKey = require('../keys/nytimesapi');
var Promise = require('bluebird');

// pullArticles() returns a promise with breaking news articles
exports.pullArticles = function(input) {
  return new Promise(function(resolve,reject) {
    nytimesKey.query = input || 20;

    console.log('Pulling down ' + nytimesKey.query + ' articles from the NYTimes newswire...')

    // GET request to the The New York Times newswire
    http.get(nytimesKey.options, function(res) {
      var data = '';
      var articles  = [];

      res.on('data', function(chunk) {
        data += chunk;
      });

      // capture all the articles in the newswire
      res.on('end', function() {
        if (res.statusCode === 200) {
          var pretty = JSON.parse(data)
          var newswire = pretty.results;
        }

        console.log(newswire);

        newswire.forEach(function(article) {
          articles.push([article.title.trim(), article.abstract.trim(), article.url]);
        });

        // if (input) {
        //   // make sure late additions are not duplicates
        //   articles.forEach(function(article) {
        //     masterlist.children.
        //   });
        // }

        resolve(articles);
      });
    });
  });
};
