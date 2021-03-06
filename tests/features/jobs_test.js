var _ = require('lodash')
  , nock = require('nock')
  , init = require('../util/init')
  , assert = require('assert')
  , request = require('supertest')
  , Job = require('../../app/models/job')
;

describe("Jobs controller", function() {
  
  beforeEach(init.dbCleanup);
  
  describe("POST /jobs", function() {
    
    it("should create a new jobs entry", function(done) {
      
      nock('http://www.google.com').get('/').reply(200, 'A search form');

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
    
    it("should discard extraneous properties", function(done) {
      
      nock('http://www.google.com').get('/').reply(200, 'A search form');

      request(init.setUp())
        .post('/jobs')
        .send({url: 'http://www.google.com', status: 'running', createdAt: '2015-06-01T01:57:26.718Z'})
        .expect(200)
        .expect(function(res) {

          assert.notEqual(res.body.createdAt, '2015-06-01T01:57:26.718Z');
          
          assert.deepEqual(res.body, {
            id: res.body.id,
            status: 'pending',
            url: 'http://www.google.com',
            createdAt: res.body.createdAt
          });

        })
        .end(done);
        
    });
    
    it("should run the requested job", function(done) {
      
      nock('http://www.google.com')
        .get('/foo')
        .reply(function() {

          process.nextTick(done);
          return [200, 'A search form'];

        });

      request(init.setUp())
        .post('/jobs')
        .send({url: 'http://www.google.com/foo'})
        .expect(200)
        .end(function(err) {
          if (err) done(err);
        });
        
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
      new Job({url: 'http://www.yahoo.com', status: 'complete', result: '<html />', statusCode: 200})
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
              result: '<html />',
              statusCode: 200
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
        .get('/jobs/556d420417b2c92d1deeabe3')
        .expect(404)
        .expect(function(res) {
          assert.deepEqual(res.body, {message: "Not found"});
        })
        .end(done);

    });
    
  });
  
});
