
var querySize = 25;
var key = '&api-key=' + process.env.NYTIMES_KEY;

exports.options = {
  host: 'api.nytimes.com',
  path: '/svc/news/v3/content/all/all.json?&limit=' + querySize + key
};