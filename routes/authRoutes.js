// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();
const {sendEmail} = require("../api/emailService");
const renderTemplate = require("../utils/templateRenderer");


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
  async (req, res) => {
    req.session.save(async () => {
      const user = req.user;

      // Render email template
      const html = renderTemplate("welcome.html", {
        user_name: user.name,
        year: new Date().getFullYear(),
        app_name: "IBC Tank Store"
      });

      // ✔ Fire-and-forget email — does not slow down login
      sendEmail({
        to: user.email,
        subject: "Sign in to IBC Tank Store",
        text: "You have signed in to IBC Tank Store",
        html
      });

      // Redirect user based on role
      if (user.role === 'admin') {
        req.flash('success', 'Welcome Admin! You have logged in successfully');
        return res.redirect('/admin/dashboard');
      }

      req.flash('success', 'You have logged in successfully');
      return res.redirect('/');
    });
  }
);

module.exports = router;