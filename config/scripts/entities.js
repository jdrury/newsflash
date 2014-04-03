var AlchemyAPI = require('../keys/alchemyapi')
  , async      = require('async')
  , nytimes    = require('./newswire')
  , Promise    = require('bluebird');

var alchemyapi = new AlchemyAPI();

// masterlist is an object to store D3 Treemap data
masterlist = {
    'name': 'newsfeed'
  , 'children': []
  , 'watchEntities': []
};

// fetch turns NYT abstracts into entities (similar to keywords)
exports.fetch = function() {
  return new Promise(function(resolve, reject) {

    // pullAbstracts() returns a promise with the breaking news abstracts
    nytimes.pullAbstracts().then(function(articles) {

      // iterate over every article with AlchemyAPI
      // fire a promise once all the entities have been collected
      async.each(articles, iterator, done);

      function iterator(article, callback) {

        // use Alchemy API to get the entities out of each NYT abstract
        alchemyapi.entities('text', article[1], {}, function(response) {
          var metadata;

          console.log('--Abstract ' + (articles.indexOf(article) + 1) + '--');
          console.log(article[1]);

          // add each entity returned by Alchemy to masterlist object
          response.entities.forEach(function(entity) {

            console.log('[' + entity.text + ']');

            if (entity.text.length < 31) {
              metadata = {
                            'name': entity.text
                          , 'headline': article[0]
                          , 'abstract': article[1]
                          , 'url': article[2]
                        };

              // collect each entity for twitter tracking and temporarily store metadata
              masterlist.watchEntities.push([entity.text, metadata]);
            }
          });

          console.log('');

          callback(null, masterlist);
        });
      };

      function done(err, results) {
        if (err) {
          console.log('ERROR: ', err);
        } else {
          console.log('Alchemy returned ' + masterlist.watchEntities.length + ' entities...');

          // when all the iterations have returned, send the promise.
          resolve(masterlist);
        }
      };

    });
  });
};
