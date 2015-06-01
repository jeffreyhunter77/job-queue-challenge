var init = require('../util/init')
  , mongooseMock = require('mongoose-mock')
  , assert = require('assert')
;

describe("Initialization", function() {
  
  describe("database", function() {
    
    it("should connect", function() {
      assert(mongooseMock.connect.called);
    });
    
    it("should preload the models", function() {
      assert(mongooseMock.model('Job'));
    });
    
  });
  
});
