const express = require('express');
const routes = express.Router();
const Snippet = require('../models/snippet');
const bodyParser = require('body-parser');

// SNIPPET PAGE =================================================
routes.get('/snippet/:snippet', function(request, response) {
  let oneSnippet = request.params.snippet;

  Snippet.find({title: oneSnippet})
  .then(snippets => response.render('snippetSearch', {snippets: snippets}))
  .catch(err => response.send('Booooooo'));
});

// USER PAGE =================================================
routes.get('/users/:user', function(request, response) {
  let userName = request.params.user;

  User.find({username: userName})
  .then(userdirectories => response.render('user', {userdirectories: userdirectories}))
  .catch(err => response.send('Booooooo'));
});
