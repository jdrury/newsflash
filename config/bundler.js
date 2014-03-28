var parser = require('./parser')
  , Promise = require('bluebird');

// initialize() removes duplicate entities and initializes remainders
exports.initialize = function() {
  return new Promise(function(resolve, reject) {

    // fetchEntities turns abstracts into entities
    parser.fetchEntities().then(function(masterlist) {

      // sort keywords to save time in duplicate search
      masterlist.keywords.sort();
      var i = masterlist.keywords.length;

      while (i--) {
        if (masterlist.keywords[i] !== masterlist.keywords[i-1]) {
          // if entity is not equal to predecessor, initialize
          masterlist.children.push({"name": masterlist.keywords[i], "children": [], "mentions": 0});
        } else {
          // entity is a duplicate, remove it
          masterlist.keywords.splice(i,1);
        }
      };

      resolve(masterlist);
    });
  });
};
