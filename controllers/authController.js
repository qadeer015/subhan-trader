// === controllers/authController.js ===

exports.logoutUser = (req, res) => {
  req.logout();
  res.redirect('/');
};

module.exports = exports;