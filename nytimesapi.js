var http    = require('http')
  , Promise = require('bluebird');

// nytimes api
var nytimes_key = '9f827b34ac633dc815206c8dab6ff00b:3:56570661'
  , options = {
      host: "api.nytimes.com",
      path: "/svc/news/v3/content/all/all.json?&limit=50&api-key=" + nytimes_key
    };

// alchemy api
var AlchemyAPI = require('./alchemyapi')
  , alchemyapi = new AlchemyAPI();

exports.pullArticles = function(callback) {
  // establish connection with NYTimes API
  http.get(options, function(res) {
    var data     = ""
      , articles = [];

    res.on('data', function(chunk) {
      data += chunk;
    });

    // save all the articles in the newswire
    res.on('end', function() {
      if (res.statusCode === 200) {
        var pretty_news = JSON.parse(data)
          , articles    = pretty_news.results;
      }

      console.log("Pulling down " + articles.length + " NYTimes articles...")

      callback(articles);
    });
  });
};

exports.getKeywords = function() {
  return new Promise(function(resolve, reject) {
    exports.pullArticles(function(articles) {
      var content  = ""
        , abstracts = ""
        , titles = []
        , cauldron = {}
        , keyterms = [];

      // pluck the abstracts from each article
      articles.forEach(function(article) {
        abstracts = article.abstract.toLowerCase();
        titles.push(article.title);
        content += abstracts + " ";
      });
      console.log(titles);

      // * * * hard-coded data * * *
      // keyterms = ['United States','North American retail finance unit in an','United States District','United States markets','American law enforcement','Southwest festival','largest news organizations','leader Viktor F.','Dmitry V. Firtash','new book','new chief executive','Federal Trade Commission','initial public offering','innovative Web journalist','broadcast network series','International Herald Tribune','mobile phone unit','Billie Joe Armstrong','GE Capital division','Chinese prime minister','education analysis company','live baseball games','Yale Repertory Theater','cellphone operator Altice','Tzu Chi Foundation','sovereign buffer state','Malaysian Airlines jetliner','Goldman Sachs trader','German flagship carrier','Buddhist charitable organization','European Union governments','Candy Crush Saga','Nasdaq OMX Copenhagen','equity firm Hellma','Le Sueur family','moderate southern governors','deadly building collapse','new leadership','New York','news conference','New South','Justice Department','revisit Paris','stylish jumpsuits','military operations','Devyani Khobragade','long-married couple','federal indictment','internal watchdog','hungry people'];
      // * * * ~~~~~ end ~~~~~ * * *


      // run all abstracts through alchemy api
      alchemyapi.keywords('text', content, {}, function(response) {
        cauldron['keywords'] = { text:content, response:JSON.stringify(response,null,4), results:response['keywords'] };

        // pick keyword results out of the returned object
        cauldron.keywords.results.forEach(function(element) {
          for(var key in element) {
            if (key === 'text') {
              keyterms.push(element[key]);
            }
          }
        });

        console.log("Alchemy found " + keyterms.length + " keywords.")
        resolve(keyterms);
      });


      // ** use this resolve for hardcoded keywords only **
      // resolve(keyterms);
      // ** !!! ** !!! **
    });
  });
};