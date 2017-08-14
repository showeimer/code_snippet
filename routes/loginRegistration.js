const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const flash = require('express-flash-messages');
const bodyParser = require('body-parser');

// PASSPORT ==========================================
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Telling Express to configure passport and flash messages
routes.use(passport.initialize());
routes.use(passport.session());
routes.use(flash());

passport.use(
  new LocalStrategy(function(email, password, done) {
    // console.log('LocalStrategy', email, password);
    User.authenticate(email, password)
      // success!!
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, null, { message: 'There was no user with this email and password.' });
        }
      })
      // there was a problem
      .catch(err => done(err));
  })
);

// Send UserID to session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Remove UserID from session for logout
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});


// LOGIN PAGE =====================================

// Login Form
routes.get('/login', (request, response) => {
  //console.log('errors:', res.locals.getMessages());
  response.render('login', { failed: request.query.failed });
});

// Login Submission
routes.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?failed=true',
    failureFlash: true
  })
);


// REGISTRATION =============================================
routes.get('/signup', (request, response) => {
  response.render('registration');
});

// Submit Registration
routes.post('/register', (request, response) => {
  let user = new User(request.body);
  user.provider = 'local';
  user.setPassword(request.body.password);

  user
    .save()
    .then(() => response.redirect('/'))
    .catch(err => console.log(err));
});

module.exports = routes;
