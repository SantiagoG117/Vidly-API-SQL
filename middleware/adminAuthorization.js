//? Third party libraries

function isAdmin(req, res, next) {
  if (!req.user.isAdmin)
    return res
      .status(403)
      .send("Access denied. Only an admin can perform this action");

  next(); // Grant access to the route handler
}

module.exports = isAdmin;
