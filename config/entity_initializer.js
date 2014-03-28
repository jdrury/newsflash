var abstract_to_entity = require('./abstract_to_entity')
  , Promise = require('bluebird');

// bundleEntities() removes duplicate entities and initializes remainders
exports.bundleEntities = function() {
  return new Promise(function(resolve, reject) {

    // abstract_to_entity turns abstracts into entities
    abstract_to_entity.translate().then(function(masterlist) {

      // sort watchEntities to save time in duplicate search
      masterlist.watchEntities.sort();
      var i = masterlist.watchEntities.length;

      while (i--) {
        // if entity is not equal to predecessor, add it to masterlist
        if (masterlist.watchEntities[i] !== masterlist.watchEntities[i-1]) {
          masterlist.children.push({"name": masterlist.watchEntities[i], "children": [], "mentions": 0});
        } else {
          // otherwise, entity is a duplicate -> remove it
          masterlist.watchEntities.splice(i,1);
        }
      };

      resolve(masterlist);
    });
  });
};
