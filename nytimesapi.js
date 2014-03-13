var http       = require('http')
  , Promise    = require('bluebird')
  , AlchemyAPI = require('./alchemyapi')
  , alchemyapi = new AlchemyAPI()
  , self       = require('./nytimesapi.js');

var nytimes_key = '9f827b34ac633dc815206c8dab6ff00b:3:56570661';

var options = {
  host: "api.nytimes.com",
  path: "/svc/news/v3/content/all/all.json?&limit=50&api-key=" + nytimes_key
};

// ====================
// To pull more than 50 articles...
// http://api.nytimes.com/svc/news/v3/content/nyt/all/.json?&limit=50&offset=0
// http://api.nytimes.com/svc/news/v3/content/nyt/all/.json?&limit=50&offset=50
// http://api.nytimes.com/svc/news/v3/content/nyt/all/.json?&limit=50&offset=100

exports.getKeywords = function() {
  return new Promise(function(resolve, reject) {
    // establish connection with NYTimes API and pull down Breaking News
    http.get(options, function(res) {
      var news = ""
        , title = ""
        , text = ""
        , articles = []
        , cauldron = {}
        , keywords = [];

      res.on('data', function(chunk) {
        news += chunk;
      });

      res.on('end', function() {
        if (res.statusCode === 200) {
          var pretty_news = JSON.parse(news)
            , articles    = pretty_news.results;
        }

        console.log("Pulling down " + articles.length + " NYTimes articles...")

        exports.wrapper = function(callback) {
          articles.forEach(function(article) {
            // pluck the abstracts from each article
            abstract = article.abstract;
            text += abstract + " ";

            // define the keywords of each abstract
            alchemyapi.keywords("text", text, {}, function(response) {
              cauldron['keywords'] = { text:text, response:JSON.stringify(response,null,4), results:response['keywords'] };

              // sort through returned object for the data we want
              cauldron.keywords.results.forEach(function(element) {
                for(var key in element) {
                  if (key === 'text') {
                    keywords.push(element[key]);
                  }
                }
              });
              callback(keywords);
            });
          });
        });

        self.wrapper(function(keywords) {
          resolve(keywords);
        });

      });
    });
  });
};