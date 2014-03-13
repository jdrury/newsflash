var http       = require('http')
  , Promise    = require('bluebird')
  , AlchemyAPI = require('./alchemyapi')
  , alchemyapi = new AlchemyAPI()
  , self       = require('./nytimesapi.js');

// nytimes api
var nytimes_key = '9f827b34ac633dc815206c8dab6ff00b:3:56570661'
  , options = {
      host: "api.nytimes.com",
      path: "/svc/news/v3/content/all/all.json?&limit=50&api-key=" + nytimes_key
    };

exports.pullArticles = function(callback) {
  // return new Promise(function(resolve, reject) {
    // establish connection with NYTimes API
  http.get(options, function(res) {
    var news = ""
      , articles = [];

    res.on('data', function(chunk) {
      news += chunk;
    });

    // save all the articles in the newswire
    res.on('end', function() {
      if (res.statusCode === 200) {
        var pretty_news = JSON.parse(news)
          , articles    = pretty_news.results;
      }

      console.log("Pulling down " + articles.length + " NYTimes articles...")

      console.log(articles)
      callback(articles);
    });
  });
};

exports.getKeywords = function() {
  return new Promise(function(resolve, reject) {
    exports.pullArticles(function(articles) {
      articles.forEach(function(article) {
        var text     = ""
          , cauldron = {}
          , keywords = [];

        // pluck the abstracts from each article
        abstract = article.abstract;
        text += abstract + " ";

        console.log(text)
        // define the keywords of each abstract
        // alchemyapi.keywords("text", text, {}, function(response) {
        //   cauldron['keywords'] = { text:text, response:JSON.stringify(response,null,4), results:response['keywords'] };
        //   console.log(cauldron.keywords.results)
        //   // sort through returned object for the data we want
        //   cauldron.keywords.results.forEach(function(element) {
        //     for(var key in element) {
        //       if (key === 'text') {
        //         keywords.push(element[key]);
        //       }
        //     }
        //   });
          resolve(keywords);
        // });
      });
    });
  });
};