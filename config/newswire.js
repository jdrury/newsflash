var http = require('http')
  , newswireKey = require('./api/nytimesapi');

exports.pullBreakingNews = function(callback) {
  // establish connection with NYTimes API
  http.get(newswireKey.options, function(res) {
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
