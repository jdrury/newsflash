// nytimes api

var nytNewswireKey = '9f827b34ac633dc815206c8dab6ff00b:3:56570661';

exports.options = {
    host: "api.nytimes.com"
  , path: "/svc/news/v3/content/all/all.json?&limit=25&api-key=" + nytNewswireKey
};