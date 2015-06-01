/**
 * Server initialization for integration/feature testing
 */

var _ = require('lodash')
  , express = require('express')
  , proxyquire = require('proxyquire')
  , path = require('path')
  , fs = require('fs')
  , config = require('../../config')
  , Q = require('q')
  , app = false
;


/**
 * Mocked version of express that stubs out the first call to app.listen()
 */
function mockedExpress() {
  app = express();
  var l = app.listen;
  
  app.listen = function() { app.listen = l; }
  
  return app;
}

// return a list of model objects
function modelList() {
  var modelDir = path.join(__dirname, '..', '..', 'app', 'models');
  
  return fs.readdirSync(modelDir)
    .filter(function(f) { return /\.js$/.test(f); })
    .map(function(f) {
      return require(path.join(modelDir, f));
    });
}

// use test config
_.extend(config, config.test);

// keep track of the models
models = modelList();

// set up a server without starting it
proxyquire('../../server', {
  './init/app': proxyquire('../../init/app', {express: mockedExpress}),
  express: mockedExpress
});

// setUp function
module.exports.setUp = function() { return app; }

// db cleanup function
module.exports.dbCleanup = function() {
  return models.reduce(function(chain, m) {
    return chain.then(function() { return Q(m.remove({})); });
  }, Q.fcall(_.noop));
}
