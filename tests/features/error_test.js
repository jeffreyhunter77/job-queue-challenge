var _ = require('lodash')
  , init = require('../util/init')
  , assert = require('assert')
  , request = require('supertest')
  , consoleError = console.error
;

describe("Error controller", function() {
  
  describe("internal error", function() {
    
    after(function() {
      console.error = consoleError;
    });
    
    it("should return a JSON error", function(done) {
      
      console.error = _.noop;
      
      request(init.setUp())
        .get('/jobs/INVALID')
        .expect(500)
        .expect(function(res) {

          assert.deepEqual(res.body, {
            message: "Cast to ObjectId failed for value \"INVALID\" at path \"_id\""
          });

        })
        .end(done);
        
    });
    
    
  });
  
});
