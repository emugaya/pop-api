var restify = require('restify');
var corsMiddleware = require('restify-cors-middleware');

// Start MongoDB
require('./models/db').Database;

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Access-Control-Allow-Origin', 'API-Token', 'authorization', 'encrypt'],
    exposeHeaders: ['API-Token-Expiry']
});

var server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.pre(cors.preflight);
server.use(cors.actual);


// Add API router
require('./common/routes.js')(server);

// NO CACHE HEADERS - REQUIRED for IE browsers, useful in general
server.pre(function(req, res, next) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  return next();
});

// ERROR HANDLERS
server.on('BadRequest', function (req, res, err, cb) {
  console.log(err);
  return cb();
});
//Uncaught exception handling
server.on('uncaughtException', (req, res, route, err) => {
  console.log(err);
  res.send(500, "Internal Server Error");
});

//START SERVER
var nodeEnv = process.env.NODE_ENV;

server.listen(process.env.PORT || 5000, function () {
  console.log("Server started on port: %s with node env: %s ", process.env.PORT, nodeEnv);
});

module.exports = server;