var AlchemyAPI = require('../keys/alchemyapi');
var async = require('async');
var nytimes = require('./newswire');
var Promise = require('bluebird');

var alchemyapi = new AlchemyAPI();

// fetch turns NYT abstracts into entities (similar to keywords)
exports.fetch = function() {
  return new Promise(function(resolve, reject) {

    // pullArticles() returns a promise with breaking news articles
    nytimes.pullArticles().then(function(articles) {
      var i, articleWrapper;

      // masterlist is a global json for the D3 treemap
      masterlist = {
        'name': 'newsfeed',
        'children': [],
        'size': 0,
        'watchEntities': []
      };

      console.log('* * * * * * *');
      console.log('entities.js');
      console.log('* * * * * * *');
      console.log('');

      // iterate over every article and send each abstract to AlchemyAPI
      // fire a promise once all the abstracts have returned entities
      async.each(articles, iterator, done);

      function iterator(article, callback) {

        // use Alchemy API to get the entities for each NYT abstract
        alchemyapi.entities('text', article[1], {}, function(response) {

          // console.log ============
          console.log('--Article #' + (articles.indexOf(article) + 1) + '--');
          console.log('HEADLINE: ' + article[0]);
          console.log('ABSTRACT: ' + article[1]);
          if (response.entities.length > 0) {
            console.log(response.entities.length + ' RESPONSE(S): ');
            console.log(response);
          } else {
            console.log('NO RESPONSE: ');
            console.log(response);
          }
          // ========================

          // if alchemy returned entities and we don't have too many entities already
          if (response.entities.length > 0 && masterlist.watchEntities.length < 19) {

            articleWrapper = {
                              'headline': article[0],
                              'abstract': article[1],
                              'url': article[2],
                              'size': 0,
                              'children': []
                            };

            masterlist.children.push(articleWrapper);
            i = masterlist.children.indexOf(articleWrapper);

            // add each entity returned by Alchemy to masterlist object
            response.entities.forEach(function(entity) {

              // if the entity is not too long and it doesn't already exist, add it
              if (entity.text.length < 31 && masterlist.watchEntities.indexOf(entity.text) === -1){
                console.log('added "' + entity.text + '"');
                entityWrapper = {
                            'name': entity.text,
                            'size': 0,
                            'children': []
                          };

                masterlist.children[i].children.push(entityWrapper);
                masterlist.watchEntities.push(entity.text);
              }
            });
          }

          console.log('');
          console.log('');

          callback(null, masterlist);
        });
      };

      function done(err, results) {
        if (err) {
          console.log('ERROR: ', err);
        } else {
          console.log('Alchemy found ' + masterlist.watchEntities.length + ' entities...');
          console.log('');
          // when all the iterations have completed, send the promise.
          resolve(masterlist);
        }
      };

    });
  });
};
