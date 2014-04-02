var http       = require('http')
  , nytimesKey = require('../keys/nytimesapi')
  , Promise    = require('bluebird');

// pullAbstracts() returns a promise with breaking news articles
exports.pullAbstracts = function() {
  return new Promise(function(resolve,reject) {

    // establish connection with NYTimes API
    http.get(nytimesKey.options, function(res) {
      var data      = ""
      var articles  = {
            'abstracts': []
          , 'headlines': []
          , 'hyperlinks': []
        };

      res.on('data', function(chunk) {
        data += chunk;
      });

      // capture all the articles in the newswire
      res.on('end', function() {
        if (res.statusCode === 200) {
          var pretty = JSON.parse(data)
            , newswire = pretty.results;
        }

        newswire.forEach(function(article) {
          articles.abstracts.push(article.abstract.trim());
          articles.headlines.push(article.title.trim());
          articles.hyperlinks.push(article.url);
        });

        console.log("Pulling down " + newswire.length + " articles from the NYTimes newswire...")
        resolve(articles);
      });
    });
  });
};
