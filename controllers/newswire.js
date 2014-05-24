var http = require('http');
var nytimesKey = require('../config/nytimes-api');
var Promise = require('bluebird');

// pullArticles() returns a promise with breaking news articles
exports.pullArticles = function() {
  return new Promise(function(resolve,reject) {

    console.log('* * * * * * *');
    console.log('newswire.js');
    console.log('* * * * * * *');
    console.log('');
    console.log('Pulling down '+ nytimesKey.querySize +' articles from the NYTimes newswire...');
    console.log('');

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
          console.log(data);
          var pretty = JSON.parse(data);
          var newswire = pretty.results;
        }

        console.log('pretty')
        console.log(newswire);

        newswire.forEach(function(article) {
          articles.push([article.title.trim(), article.abstract.trim(), article.url]);
        });

        resolve(articles);
      });
    });
  });
};
