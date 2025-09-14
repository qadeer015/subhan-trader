// === routes/authRoutes.js ===
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();

// Login routes
router.get('/signin', (req, res) => {
  res.render('auth/signin', { user: req.user, title:'Signin'});
});

router.post('/logout', authController.logoutUser);

// authRoutes.js
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth/signin',
    failureFlash: true
  }),
  (req, res) => {
    req.session.save(() => {  // Explicitly save session
      if(req.user.role == 'admin'){
        req.flash('success', 'Welcome Admin! You have logged in successfully');
        return res.redirect('/admin/dashboard');
      }else{
      req.flash('success', 'You have logged in successfully');
      res.redirect('/');
      }
    });
  }
);
module.exports = router;