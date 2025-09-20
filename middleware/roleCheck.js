function checkRole(role) {
  return function (req, res, next) {
    if (req.user && req.user.role === role) {
      return next();
    }
    res.status(403).send("Forbidden");
  };
}

module.exports = { checkRole };
