var Q = require('q')
  , express = require('express')
  , bodyParser = require('body-parser')
  , jobsController = require('../app/controllers/jobs_controller')
;

/**
 * Initialize the express app and routes
 */

module.exports = function(config) {
  var deferred = Q.defer();
  
  var app = express();
  
  // config
  app.use(bodyParser.json());
  
  // routes
  app.post('/jobs', jobsController.create);
  
  deferred.resolve(app);
  
  return deferred.promise;
}
