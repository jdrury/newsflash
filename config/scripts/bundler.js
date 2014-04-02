var entities = require('./entities')
  , Promise  = require('bluebird');

// initializeEntities() removes duplicate entities and initializes remainders
exports.initializeEntities = function() {
  return new Promise(function(resolve, reject) {

    // abstract_to_entity turns abstracts into entities
    entities.fetch().then(function(masterlist) {

      // sort watchEntities to save time in duplicate search
      masterlist.watchEntities.sort();
      console.log("before sort: " + masterlist.watchEntities);
      var i = masterlist.watchEntities.length;
      var temp = [];
      while (i--) {
        if (i > 1) {
          // if entity is not equal to predecessor, add it to masterlist
          if (masterlist.watchEntities[i][0] !== masterlist.watchEntities[i-1][0] && masterlist.watchEntities[i][0].length < 20) {
            masterlist.children.push({"name": masterlist.watchEntities[i][0], "children": [], "mentions": 0, "metadata": masterlist.watchEntities[i][1]});
            temp.push(masterlist.watchEntities[i][0])
          }
        }
      };
      masterlist.watchEntities = temp;
      resolve(masterlist);
    });
  });
};
