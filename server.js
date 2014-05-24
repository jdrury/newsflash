var express = require('express');
var app = express();
var CronJob = require('cron').CronJob;
var path = require('path');
var server = require('http').createServer(app);

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

app.configure(function() {
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.errorHandler());
  app.use(express.urlencoded());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'app/public')));
});

if (!process.env.NODE_ENV) {
  var local = require('./config/secret');
  process.env.NYTIMES_KEY = local.nytimes;
  process.env.ALCHEMY_KEY = local.alchemy;
  process.env.TWITTER_CONSUMER_KEY = local.twit1;
  process.env.TWITTER_CONSUMER_SECRET = local.twit2;
  process.env.TWITTER_ACCESS_TOKEN_KEY = local.twit3;
  process.env.TWITTER_ACCESS_TOKEN_SECRET = local.twit4;
}

var io = require('socket.io').listen(server);
var firehose = require('./controllers/firehose');

app.get('/', function(req, res) {
  res.render('index', {'masterlist': masterlist});
});

server.listen(app.get('port'), function() {
  // console.log('Express server listening on port ' + app.get('port'));
});

/* = = = = = =
    SOCKET.IO
   = = = = = = */

// socket.io config for Heroku
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function() {
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);
});

io.sockets.on('connection', function() {
});

// emit update to client on every callback
firehose.matchFinder(function(masterlist) {
  io.sockets.emit('update', {'masterlist': masterlist});
});

// reset every 48 minutes
var job = new CronJob('0 */48 * * * *', function(){
  firehose.matchFinder(function(masterlist) {
    io.sockets.emit('update', {'masterlist': masterlist});
  });
  start: false;
});

job.start();
