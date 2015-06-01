var _ = require('lodash')
  , init = require('../util/init')
  , assert = require('assert')
  , request = require('supertest')
;

describe("Jobs controller", function() {
  
  beforeEach(init.dbCleanup);
  
  describe("POST /jobs", function() {
    
    it("should create a new jobs entry", function(done) {
      
      request(init.setUp())
        .post('/jobs')
        .send({url: 'http://www.google.com'})
        .expect(200)
        .expect(function(res) {

          assert.ok(/^[0-9a-f]+$/.test(res.body.id));
          assert.ok(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(res.body.createdAt));
          
          assert.deepEqual(res.body, {
            id: res.body.id,
            status: 'pending',
            url: 'http://www.google.com',
            createdAt: res.body.createdAt
          });

        })
        .end(done);
        
    });
    
  });
  
});
