var keychain = require('./keychain');

exports.keys = {
  consumer_key        : keychain.twitter_ck,
  consumer_secret     : keychain.twitter_cs,
  access_token_key    : keychain.twitter_atk,
  access_token_secret : keychain.twitter_ats
};