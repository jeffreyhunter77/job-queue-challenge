var _ = require('lodash')
  , init = require('../util/init')
  , assert = require('assert')
  , Job = require('../../app/models/job')
  , Q = require('q')
;

describe("Job model", function() {
  
  beforeEach(init.dbCleanup);
  
  describe("nextRunnable", function() {
    
    it("should retrieve the next pending job", function() {
      
      var expectedId = null;
      
      return Q(new Job({url: 'http://www.google.com'})
        .save())
        .then(function(job) {

          expectedId = job.id;
          return Job.nextRunnable()

        })
        .then(function(job) {
          
          assert.ok(job);
          assert.strictEqual(job.id, expectedId);
          assert.strictEqual(job.status, 'running');
          
        });
      
    });
    
    it("should return null for no next available job", function() {

      return Q(new Job({url: 'http://www.google.com', status: 'running'})
        .save())
        .then(function(job) {

          return Job.nextRunnable()

        })
        .then(function(job) {
          
          assert.ok(!job);
          
        });

    });
    
  });
  
  
  describe("complete", function() {
    
    it("should update the job with a result and save it", function() {
      
      return Q(new Job({url: 'http://www.google.com', status: 'running'})
        .save())
        .then(function(job) {

          return job.complete(200, 'the result');

        })
        .then(function(job) {
          
          assert.strictEqual(job.status, 'complete');
          assert.strictEqual(job.result, 'the result');
          assert.strictEqual(job.statusCode, 200);
          assert(!job.isModified());
          
        });

    });
    
    it("should save the status code", function() {
      
      return Q(new Job({url: 'http://www.google.com', status: 'running'})
        .save())
        .then(function(job) {

          return job.complete(500, 'internal error');

        })
        .then(function(job) {
          
          assert.strictEqual(job.status, 'complete');
          assert.strictEqual(job.result, 'internal error');
          assert.strictEqual(job.statusCode, 500);
          assert(!job.isModified());
          
        });

    });

  });
  

  describe("completeWithError", function() {
    
    it("should update the job with a message and save it", function() {
      
      return Q(new Job({url: 'http://www.google.com', status: 'running'})
        .save())
        .then(function(job) {

          return job.completeWithError('An error message');

        })
        .then(function(job) {
          
          assert.strictEqual(job.status, 'error');
          assert.strictEqual(job.message, 'An error message');
          assert(!job.isModified());
          
        });

    });
    
  });

});
