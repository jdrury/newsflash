
if ('development' == app.get('env')) {
  var local = require('./secret');
}

exports.nytimes_key = process.env.NYTIMES_KEY || local.nytimes;
exports.alchemy_key = process.env.ALCHEMY_KEY || local.alchemy;
exports.twitter_ck  = process.env.TWITTER_CONSUMER_KEY || local.twit1;
exports.twitter_cs  = process.env.TWITTER_CONSUMER_SECRET || local.twit2;
exports.twitter_atk = process.env.TWITTER_ACCESS_TOKEN_KEY  || local.twit3;
exports.twitter_ats = process.env.TWITTER_ACCESS_TOKEN_SECRET || local.twit4;

