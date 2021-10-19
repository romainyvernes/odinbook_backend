const passport = require('passport');

exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

exports.authenticateLocally = passport.authenticate('local', {
  failureFlash: true
});