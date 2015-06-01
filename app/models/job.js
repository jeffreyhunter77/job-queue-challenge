var mongoose = require('mongoose')
;

/**
 * Model for a job entry in the queue
 */

var JobSchema = new mongoose.Schema({
  status: {type: String, required: true, default: 'pending', 
    'enum': ['pending', 'running', 'complete', 'error']},
  url: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  result: String,
  message: String
});

module.exports = mongoose.model('Job', JobSchema);
