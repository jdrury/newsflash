var http       = require('http')
  , nytimesKey = require('../keys/nytimesapi')
  , Promise    = require('bluebird');

// pullAbstracts() returns a promise with breaking news articles
exports.pullAbstracts = function() {
  return new Promise(function(resolve,reject) {

    // establish connection with The New York Times breaking news API
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

        newswire.forEach(function(article) {
          articles.push([article.title.trim(), article.abstract.trim(), article.url]);
        });

        console.log('Pulling down ' + articles.length + ' articles from the NYTimes newswire...')

        resolve(articles);
      });
    });
  });
};
