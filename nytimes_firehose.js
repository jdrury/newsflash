var http = require('http')
  , nytimes_key = '9f827b34ac633dc815206c8dab6ff00b:3:56570661'
  , options = {
    host: "api.nytimes.com",
    path: "/svc/news/v3/content/all/all.json?api-key=" + nytimes_key
  }
  , Promise = require('bluebird')
  ;

exports.getKeywords = function() {
  return new Promise(function(resolve, reject) {
    http.get(options, function(res) {
      var news = ""
        , keywords
        , articleCollection = []
        , junkWords = ['a', 'an', 'and', 'at', 'by', 'for', 'i', 'in', 'of', 'the', 'to', 'our'];

      res.on('data', function(chunk) {
        news += chunk;
      });

      res.on('end', function() {
        if (res.statusCode == 200) {
          var pretty_news = JSON.parse(news)
            , articles    = pretty_news.results;
        }

        articles.forEach(function(e,i) {
          articleCollection.push(articles[i].title.trim().toLowerCase().split(' '));
          keywords = articleCollection.concat.apply([], articleCollection);
        });

        resolve(keywords);
      });
    });
  });
}

// To pull all data into separate file:
// curl http://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=9f827b34ac633dc815206c8dab6ff00b:3:56570661 | underscore print -o store.js