var Q = require('q')
  , express = require('express')
;

/**
 * Initialize the express app and routes
 */

module.exports = function(config) {
  var deferred = Q.defer();
  
  var app = express();
  
  deferred.resolve(app);
  
  return deferred.promise;
}
