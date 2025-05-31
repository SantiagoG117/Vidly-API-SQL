/* 
    Factory Function: Returns a reference of a route handler function (which is async by default) that takes the req, res and next parametes

    At runtime, Express will call this function reference and provide the values for the req, res and next parameters, which are required to 
    execute the routeHandler parameter or pass control to the error middleware function through the next() parameter in case of rejected promises
*/
function asyncMiddleWare(routeHandler) {
  return async (req, res, next) => {
    try {
      await routeHandler(req, res); //At runtime, routeHanlder will be called and express will provide the values for the req and res parameters
    } catch (ex) {
      next(ex); //In case of rejected promises at runtime, Express will provide the value for next and pass the exception to the error middleware
    }
  };
}

module.exports = asyncMiddleWare;
