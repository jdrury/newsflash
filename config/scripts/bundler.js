var entities = require('./entities');
var Promise = require('bluebird');

function alphabetize(a,b) {
  if (a[0] < b[0]) {
    return -1;
  }
  if (a[0] > b[0]) {
    return 1;
  }
}

// initializeEntities() removes duplicate entities and initializes remainders
exports.initializeEntities = function() {
  return new Promise(function(resolve, reject) {

    // fetch() gets entities for each abstract
    entities.fetch().then(function(masterlist) {
      // var i = masterlist.watchEntities.length;
      // var entitylist = [];
      // var entity = {};

      // // sort entities in preparation for comparison
      // masterlist.watchEntities.sort(alphabetize);

      // console.log(i + ' entities before comparing', masterlist.watchEntities);
      // console.log('');

      // // check for duplicates - compare each entity to the entity before it
      // while (i--) {

      //   entity = {
      //             'name': masterlist.watchEntities[i].name,
      //             'headline': masterlist.watchEntities[i].headline,
      //             'abstract': masterlist.watchEntities[i].abstract,
      //             'url': masterlist.watchEntities[i].url,
      //             'children': [],
      //             'mentions': 0
      //           };

      //   if (i === 0) {
      //     // if it's the last item, add the entity without comparing
      //     masterlist.children.push(entity);
      //     entitylist.push(entity.name);

      //   } else if (masterlist.watchEntities[i].name !== masterlist.watchEntities[i-1].name) {
      //     // if entity is not equal to predecessor, add it to masterlist
      //     masterlist.children.push(entity);
      //     entitylist.push(entity.name);

      //   }

      // };

      // // save watchEntities as a sorted, unique, one-dimensional list for Twitter tracking
      // masterlist.watchEntities = entitylist.sort();

      // console.log(masterlist.watchEntities.length + ' entities after comparing', masterlist.watchEntities);

      resolve(masterlist);
    });
  });
};
