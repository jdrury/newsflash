var http = require('http');

var nytimes_key = '9f827b34ac633dc815206c8dab6ff00b:3:56570661';

var options = {
      host: "api.nytimes.com",
      path: "/svc/news/v3/content/all/all.json?&limit=50&api-key=" + nytimes_key
    };

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
