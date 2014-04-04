var express = require('express');
var app = express();
var CronJob = require('cron').CronJob;
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var firehose = require('./config/scripts/firehose');

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

app.get('/', function(req, res) {
  res.render('index', {'masterlist': masterlist});
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// ==============

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

// // reset every 5 minutes
// var job = new CronJob('0 */5 * * * *', function(){

//   masterlist.children.forEach(function(entity,key) {
//     var killEntities = [];
//     var replacements;

//     if (entity.mentions / masterlist.mentions < 0.03) {
//       // identify entities with less than 3% of total mentions
//       killEntities.push(key);
//     }

//     // number of new articles to add
//     replacements = killEntities.length;

//     // remove entities
//     killEntities.forEach(function(i) {
//       masterlist.children.splice(i,1);
//     });

//     articles = nytimes.pullArticles(replacements);

//   }

//   firehose.matchFinder(function(masterlist) {
//     io.sockets.emit('update', {'masterlist': masterlist});
//   });
//   start: false;
// });

// job.start();
