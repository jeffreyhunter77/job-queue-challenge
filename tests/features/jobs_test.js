var _ = require('lodash')
  , init = require('../util/init')
  , assert = require('assert')
  , request = require('supertest')
  , Job = require('../../app/models/job')
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
  
  
  describe("GET /jobs/:id", function() {
    
    it("should return the status of a pending job", function(done) {
      
      new Job({url: 'http://www.yahoo.com'})
        .save()
        .then(function(job) {
          
          request(init.setUp())
          .get('/jobs/' + job.id)
          .expect(200)
          .expect(function(res) {
            
            assert.ok(/^[0-9a-f]+$/.test(res.body.id));
            assert.ok(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(res.body.createdAt));

            assert.deepEqual(res.body, {
              id: res.body.id,
              status: 'pending',
              url: 'http://www.yahoo.com',
              createdAt: res.body.createdAt
            });

          })
          .end(done);
          
        });
    });
    
    it("should return the result of a completed job", function() {
      new Job({url: 'http://www.yahoo.com', status: 'complete', result: '<html />'})
        .save()
        .then(function(job) {
          
          request(init.setUp())
          .get('/jobs/' + job.id)
          .expect(200)
          .expect(function(res) {
            
            assert.ok(/^[0-9a-f]+$/.test(res.body.id));
            assert.ok(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(res.body.createdAt));

            assert.deepEqual(res.body, {
              id: res.body.id,
              status: 'complete',
              url: 'http://www.yahoo.com',
              createdAt: res.body.createdAt,
              result: '<html />'
            });

          })
          .end(done);
          
        });
    });
    
    it("should return an error message for a failed job", function() {
      new Job({url: 'http://www.yahoo.com', status: 'error', message: 'Timeout'})
        .save()
        .then(function(job) {
          
          request(init.setUp())
          .get('/jobs/' + job.id)
          .expect(200)
          .expect(function(res) {
            
            assert.ok(/^[0-9a-f]+$/.test(res.body.id));
            assert.ok(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(res.body.createdAt));

            assert.deepEqual(res.body, {
              id: res.body.id,
              status: 'error',
              url: 'http://www.yahoo.com',
              createdAt: res.body.createdAt,
              message: 'Timeout'
            });

          })
          .end(done);
          
        });
    });
    
    it("should return 'not found' for an invalid job id", function(done) {
      
      request(init.setUp())
        .get('/jobs/1234')
        .expect(404)
        .expect(function(res) {
          assert.deepEqual(res.body, {message: "Not found"});
        })
        .end(done);

    });
    
  });
  
});
