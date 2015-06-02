var JobRunner = require('../../lib/job_runner')
  , nock = require('nock')
  , assert = require('assert')
  , Q = require('q')
  , proxyquire = require('proxyquire')
;

describe("JobRunner", function() {
  
  afterEach(nock.cleanAll);
  
  describe("run", function() {
    
    it("should retrieve the content from a given url", function(done) {
      
      nock('http://google.com')
        .get('/')
        .reply(200, 'A search form');
      
      var job = {
        url: 'http://google.com',
        save: function() { return Q.fcall(function() { return job; }); },
        complete: function(statusCode, result) {
          
          assert.strictEqual(statusCode, 200);
          assert.strictEqual(result, 'A search form');
          
          done();
        }
      };

      new JobRunner().run(job).done();
      
    });
    
    
    it("should record any error received", function(done) {
      
      var JobRunner = proxyquire('../../lib/job_runner',
        {request: function() { throw new Error("Timeout"); }});

      var job = {
        url: 'http://google.com',
        save: function() { return Q.fcall(function() { return job; }); },
        completeWithError: function(message) {
          
          assert.strictEqual(message, 'Timeout');
          
          done();
        }
      };

      new JobRunner().run(job).done();
      
    });

  });
  
});
