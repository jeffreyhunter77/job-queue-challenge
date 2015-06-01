var init = require('../util/init')
  , mongoose = require('mongoose')
  , assert = require('assert')
;

describe("Initialization", function() {
  
  describe("database", function() {
    
    it("should connect", function() {
      assert(mongoose.connection.name);
    });
    
    it("should preload the models", function() {
      assert(mongoose.model('Job'));
    });
    
  });
  
});
