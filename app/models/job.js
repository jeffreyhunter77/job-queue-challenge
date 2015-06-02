var mongoose = require('mongoose')
  , Q = require('q')
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


/**
 * Return the next avaible job and mark it as running
 *
 * The original intent of this function was to be used to implement some
 * crash recovery at startup. For now I decided to hold off on that
 * feature.
 *
 * It could also be used to implement a more sophisticated version of the
 * service which limits the number of jobs worked at one time or which
 * allows multiple worker processes. For now this is assumed to be out of
 * scope.
 */
JobSchema.static('nextRunnable', function() {
  
  return Q(
    this.findOneAndUpdate({status: 'pending'}, {status: 'running'}, {new: true})
    .exec()
  );
  
});

/**
 * Update a job with a result and mark it as complete
 */
JobSchema.method('complete', function(result) {
  
  this.set('result', result);
  this.set('status', 'complete');
  
  return Q(this.save());
  
});

/**
 * Update a job with an error and mark it as completed with error
 */
JobSchema.method('completeWithError', function(message) {

  this.set('message', message);
  this.set('status', 'error');
  
  return Q(this.save());

});


module.exports = mongoose.model('Job', JobSchema);
