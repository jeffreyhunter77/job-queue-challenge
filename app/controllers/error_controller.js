/**
 * Error handling
 */
module.exports.handleError = function(err, req, res, next) {
  
  console.error("Error: %s", err.stack ? err.stack : err);
  
  res.status(500).send({message: err.message ? err.message : String(err)});
  
}
