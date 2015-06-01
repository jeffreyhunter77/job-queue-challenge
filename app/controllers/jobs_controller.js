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
