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
}, {

  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }

});

module.exports = mongoose.model('Job', JobSchema);
