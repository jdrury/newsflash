// nytimes api

var newswireKey = '24995b8ee4501f3b552ed25e8a608801:10:68945244';
exports.querySize = 15;

exports.options = {
  host: 'api.nytimes.com',
  path: '/svc/news/v3/content/all/all.json?&limit=' + exports.querySize + '&api-key=' + newswireKey
};