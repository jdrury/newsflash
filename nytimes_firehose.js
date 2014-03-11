var http = require('http')
  , nytimes_key = '9f827b34ac633dc815206c8dab6ff00b:3:56570661'
  , options = {
    host: "api.nytimes.com",
    path: "/svc/news/v3/content/all/all.json?api-key=" + nytimes_key
  }
  , Promise = require('bluebird');

exports.getKeywords = function() {
  return new Promise(function(resolve, reject) {
    http.get(options, function(res) {
      var news = ""
        , count = 0
        , keywords
        , titleCollection = []
        , filteredKeywords = []
        , junkwords = ["", "a", "an", "and", "at", "of", "in", "on", "the", "was"];

      res.on('data', function(chunk) {
        news += chunk;
      });

      res.on('end', function() {
        if (res.statusCode == 200) {
          var pretty_news = JSON.parse(news)
            , articles    = pretty_news.results;
        }

        console.log("Pulling down " + articles.length + " NYTimes articles...")
        // Why is it only pulling down 20 articles?

        articles.forEach(function(e,i) {
          titleCollection.push(articles[i].title.trim().toLowerCase().split(' '));
          // remove duplicates
          keywords = titleCollection.concat.apply([], titleCollection);
          // remove junk words
          keywords.map(function(word) {
            junkwords.forEach(function(junk) {
              if (word === junk) {
                keywords.splice(keywords.indexOf(word),1);
                count += 1;
                // console.log("deleted ", word);
              };
            });
          });
          console.log("Deleted " + count + " junkword(s).")
          console.log("Pulled " + keywords.length + " keyword(s).")
          resolve(keywords);
        });
      });
    });
  });
}

// curl http://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=9f827b34ac633dc815206c8dab6ff00b:3:56570661 | underscore print -o store.js