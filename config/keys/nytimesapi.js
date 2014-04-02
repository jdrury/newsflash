// nytimes api

var nytNewswireKey = '24995b8ee4501f3b552ed25e8a608801:10:68945244';

exports.options = {
    host: "api.nytimes.com"
  , path: "/svc/news/v3/content/all/all.json?&limit=20&api-key=" + nytNewswireKey
};