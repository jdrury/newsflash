var http = require('http')
  , nytimes_key = '9f827b34ac633dc815206c8dab6ff00b:3:56570661'
  , options = {
    host: "api.nytimes.com",
    path: "/svc/news/v3/content/all/all.json?api-key=" + nytimes_key
  };

var request = http.get(options, function(res) {
  var news = ""
    , keywords
    , articleCollection = [];

  res.on('data', function(chunk) {
    news += chunk;
  });

  res.on('end', function() {
    if (res.statusCode == 200) {
      var pretty_news = JSON.parse(news)
        , articles    = pretty_news.results;
    }

    articles.forEach(function(e,i) {
      // console.log(articles[i].title);
      articleCollection.push(articles[i].title.split(' '));
      keywords = articleCollection.concat.apply([], articleCollection);
      // collection of words drawn from titles
      // console.log(keywords)
    });
  });
});

exports.feed = request;

// To pull all data into separate file:
// curl http://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=9f827b34ac633dc815206c8dab6ff00b:3:56570661 | underscore print -o store.js