var http        = require('http')
  , Promise     = require('bluebird')
  , newswireKey = require('./api/nytimesapi');

// pullBreakingNews() returns a promise with breaking news articles
exports.pullBreakingNews = function() {
  return new Promise(function(resolve, reject) {

    // establish connection with NYTimes API
    http.get(newswireKey.options, function(res) {
      var data = "";

      res.on('data', function(chunk) {
        data += chunk;
      });

      // read all the articles in the newswire
      res.on('end', function() {
        if (res.statusCode === 200) {
          var pretty = JSON.parse(data)
            , newswire = pretty.results;
        }

        console.log("Pulling down " + newswire.length + " articles from the NYTimes newswire...")

        resolve(newswire);
      });
    });
  });
};
