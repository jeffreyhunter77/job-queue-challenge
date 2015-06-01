var config = require('./config');

function port() {
  return config.port || process.env.PORT || 3000;
}

require('./init/app')(config)
.then(function(app) {

  return require('./init/db')(config, app);

})
.then(function(app) {

  var server = app.listen(port(), function() {
    console.log("Server listening at %s:%s",
      server.address().address, server.address().port);
  });

})
.catch(function(error) {

  console.error("Failed to start server: %s",
    (error && error.stack ? error.stack : error))

})
.done();
