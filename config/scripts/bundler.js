var entities = require('./entities')
  , Promise  = require('bluebird');

// initializeEntities() removes duplicate entities and initializes remainders
exports.initializeEntities = function() {
  return new Promise(function(resolve, reject) {

    // abstract_to_entity turns abstracts into entities
    entities.fetch().then(function(masterlist) {

      // sort watchEntities to save time in duplicate search
      masterlist.watchEntities.sort();
      // empty masterlist.children in case this is a refresh
      masterlist.children = [];
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
      console.log("inside bundler");
      resolve(masterlist);
    });
  });
};
