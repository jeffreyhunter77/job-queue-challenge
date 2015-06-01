var Job = require('../models/job')
;

/**
 * Create a new job
 */
module.exports.create = function(req, res, next) {
  new Job(req.body)
    .save()
    .then(function(job) {
      res.send(job);
    })
    .end(next);
}

/**
 * Find an existing job
 */
module.exports.show = function(req, res, next) {
  
  Job.findOne(req.params.id)
    .exec()
    .then(function(job) {
      if (job)
        res.send(job);
      else
        res.status(404).send({message: "Not found"});
    })
    .end(next);
  
}
