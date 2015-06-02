var Job = require('../models/job')
  , _ = require('lodash')
  , JobRunner = require('../../lib/job_runner')
;

/**
 * Create a new job
 */
module.exports.create = function(req, res, next) {
  new Job(_.pick(req.body, ['url']))
    .save()
    .then(function(job) {
      res.send(job);
      
      new JobRunner().run(job).done();

    })
    .end(next);
}

/**
 * Find an existing job
 */
module.exports.show = function(req, res, next) {
  
  Job.findById(req.params.id)
    .exec()
    .then(function(job) {
      if (job)
        res.send(job);
      else
        res.status(404).send({message: "Not found"});
    })
    .end(next);
  
}
