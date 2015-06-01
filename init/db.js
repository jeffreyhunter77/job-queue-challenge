var Q = require('q')
  , fs = require('fs')
  , path = require('path')
  , mongoose = require('mongoose')
;

module.exports = function(config, app) {
  
  return Q.ninvoke(mongoose, 'connect', config.mongoUrl)
    .then(function() {
      
      // preload all model files from ../app/models
      
      var modelDir = path.join(__dirname, '..', 'app', 'models');
      
      fs.readdirSync(modelDir).forEach(function(f) {
        if (/\.js$/.test(f)) require(path.join(modelDir, f));
      });
      
      return app;
      
    });
}
