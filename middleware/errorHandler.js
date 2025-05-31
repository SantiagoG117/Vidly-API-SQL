const winston = require("winston");

/* 
?   Middleware function:
    Assumes control of the req-res process if an error occurs in the Request processing pipeline and returns
    a response with a status 500 indicating an internal server error.
*/
function errorHandler(err, req, res, next) {
  winston.error(err.message);
  return res
    .status(500)
    .send("Something failed on our side. Please try again later");
}

module.exports = errorHandler;
