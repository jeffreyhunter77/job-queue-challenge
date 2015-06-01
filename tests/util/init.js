/**
 * Server initialization for integration/feature testing
 */

var _ = require('lodash')
  , express = require('express')
  , mongooseMock = require('mongoose-mock')
  , proxyquire = require('proxyquire')
  , sinon = require('sinon')
  , path = require('path')
  , fs = require('fs')
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

/**
 * Semi-functional connect mock
 */
mongooseMock.connect = sinon.stub(); // bug: not setup correctly in mongoose-mock
mongooseMock.connect.callsArg(1);


// set up injection of mock dependencies
var mocks = {express: mockedExpress, mongoose: mongooseMock};

function mocksWithModels() {
  var overrides = _.extend({}, mocks);
  var modelDir = path.join(__dirname, '..', '..', 'app', 'models');
  
  fs.readdirSync(modelDir).forEach(function(f) {
    if (/\.js$/.test(f))
      overrides[path.join(modelDir, f)] = proxyquire(path.join(modelDir, f), mocks);
  });
  
  return overrides;
}

proxyquire('../../server',
  _.extend({
    './init/db': proxyquire('../../init/db', mocksWithModels()),
    './init/app': proxyquire('../../init/app', mocks)
  }, mocks));

// setUp function
module.exports.setUp = function() { return app; }
