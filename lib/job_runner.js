var _ = require('lodash')
  , request = require('request')
  , Q = require('q')
;

/**
 * Performs a job and records the result
 */
function JobRunner() {
}

_.extend(JobRunner.prototype, {
  
  /**
   * Run a job
   */
  run: function(job) {
    
    job.status = 'running';
    
    return Q(job.save())
      .then(function() {

        return Q.nfcall(request, {url: job.url});

      })
      .then(function(args) {

        return job.complete(args[0].body);

      })
      .catch(function(err) {
        
        return job.completeWithError(err.message ? err.message : err);

      })
      .catch(function(err) {
        
        console.error("Failed to update job: %s", err.stack ? err.stack : err);
        
      });
    
  }
  
});

module.exports = JobRunner;
