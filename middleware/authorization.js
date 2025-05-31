//? Third party libraries
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* 
    ? Middleware function:
    Takes a request object and validates the JSON Web Token of the current user.
    If valid, it passes control to the next middleware function in the Request Processing Pipeline.
    If the token is invalid, it returns a response with a 400 access denied status, thus terminating
    the request-response lifecycle
*/

function authorization(req, res, next) {
  //Read the request header to find the JSON Web token
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Access denied. No token was provided.");

  //Verify if the token is valid.
  try {
    //Extract the decoded payload
    const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    //Attach the decoded payload to the req body
    req.user = payload;
    //Pass control to the route handler (next middleware function in the Request Processing Pipeline)
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = authorization;
