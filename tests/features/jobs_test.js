var _ = require('lodash')
  , init = require('../util/init')
  , mongooseMock = require('mongoose-mock')
  , assert = require('assert')
  , request = require('supertest')
;

// stub out the save operation to produce a result
function documentSaveReturns(result) {
  return function(model) {
    model.save = function(fn) {
      if (fn) process.nextTick(function() { fn(undefined, result); });
      
      return {
        then: function(fn) {
          fn(result);
          return {end: _.noop};
        }
      };
    };
  };
}


describe("Jobs controller", function() {
  
  describe("POST /jobs", function() {
    
    it("should create a new jobs entry", function(done) {
      
      var job = {
        id: '556bbc066262dca111af2876',
        status: 'pending',
        url: 'http://www.google.com',
        createdAt: "2015-06-01T01:57:26.718Z"
      };
      
      // stub out save behavior
      mongooseMock.once('document', documentSaveReturns(job));
      
      request(init.setUp())
        .post('/jobs')
        .send({url: 'http://www.google.com'})
        .expect(200)
        .expect(function(res) {
          assert.deepEqual(res.body, job);
        })
        .end(done);
        
    });
    
  });
  
});
