var express = require('express');
var router = express.Router();
const passport = require('passport');
const oAuthCtrl = require('../Controllers/oAuth.controller')

// Redirect for Home Page
router.get('/', function(req, res, next) {
  res.redirect('/posts/all');
});

// Error Redirect
router.get('/error', function(req,res, next) {
  res.render('error')
})

// Google OAuth login route - declare in a separate oAuth controller after setup
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

// Google OAuth callback route
router.get('/oauthcallback',
  passport.authenticate('google', {
    successRedirect: '/posts',
    failureRedirect: '/posts/all',
  })
);

// OAuth logout route
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/posts/all');
});

module.exports = router;



