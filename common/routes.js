var restify = require('restify');
var version = require('../endpoints/version.js');
var population = require('../endpoints/population')

// helpers
var _ver = function(pathName, version){
  return { 'path': pathName, 'version': version || '1.0.0' };
}


var _parsers = [
  restify.plugins.queryParser(),
  restify.plugins.bodyParser()
];

//endpoints
exports = module.exports = function(server){
  // API Version
  server.get(_ver('/api-versions'), _parsers, version.list);
  
  // Population Endpoints

  // Get all Locations
  server.get(_ver('/locations'), _parsers, population.getAllLocations);

  // Get Single Location
  server.get(_ver('/locations/:id'), _parsers, population.getLocation);

  // Create Location
  server.post(_ver('/locations'), _parsers, population.createLocation);

  // Update Location
  server.put(_ver('/locations/:id'), _parsers, population.updateLocation);

  // Delete Location
  server.del(_ver('/locations/:id'), _parsers, population.deleteLocation);




  server.get('/',function(req,res,next){
    res.send(200, 'Population Management API');
    return next();
  });
}