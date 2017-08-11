const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const flash = require('express-flash-messages');
const bodyParser = require('body-parser');

// PASSPORT ==========================================
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// connect passport to express boilerplate
routes.use(passport.initialize());
routes.use(passport.session());
routes.use(flash());

// configure passport
passport.use(
  new LocalStrategy(function(email, password, done) {
    console.log('LocalStrategy', email, password);
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

// store the user's id in the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// get the user from the session based on the id
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
routes.post(
  '/login',
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
    // if good...
    .then(() => response.redirect('/'))
    // if bad...
    .catch(err => console.log(err));
});


module.exports = routes;
