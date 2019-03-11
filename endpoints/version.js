var restify = require('restify');

var _list = function(req,res,next){
  var list = [{'version':'1.0.0','description':'Population Management API v1','date':'2019-03-01'}];
  res.send(200,list);
  return next();
};

module.exports = {
  list : _list
};
