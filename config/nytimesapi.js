var keychain = require('./keychain');

var newswireKey   = keychain.nytimes_key;
exports.querySize = 25;

exports.options = {
  host: 'api.nytimes.com',
  path: '/svc/news/v3/content/all/all.json?&limit=' + exports.querySize + '&api-key=' + newswireKey
};