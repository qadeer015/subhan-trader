// controllers/authController.js
exports.logoutUser = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    // Save flash message first
    req.flash('success', 'You have been logged out successfully');

    req.session.destroy(err => {
      if (err) return next(err);

      res.clearCookie('connect.sid'); // clear session cookie
      res.redirect('/');
    });
  });
};
