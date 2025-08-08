const isAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
          return next();
        }
        req.flash('error', 'Please login to access this page');
        res.redirect('/auth/signin');
      };
      
      // Check if user is admin
      const isAdmin = (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === 'admin') {
          return next();
        }
        req.flash('error', 'You do not have admin privileges');
        res.redirect('/');
      };
      
      module.exports = {
        isAuthenticated,
        isAdmin
      };