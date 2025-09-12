// === routes/authRoutes.js ===
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();

// Login routes
router.get('/signin', (req, res) => {
  res.render('auth/signin', { user: req.user, title:'Signin',
    messages: {
      error: req.flash('error')[0],
      success: req.flash('success')[0]
    }
  });
});

router.delete('/logout', authController.logoutUser);

// authRoutes.js
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth/signin',
    failureFlash: true
  }),
  (req, res) => {
    req.session.save(() => {  // Explicitly save session
      res.redirect('/');
    });
  }
);
module.exports = router;