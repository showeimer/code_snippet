const express = require('express');
const routes = express.Router();
const Snippet = require('../models/snippet');
const bodyParser = require('body-parser');


// SNIPPET PAGE =================================================
routes.get('/:snippet', function(request, response) {
  let oneSnippet = request.params.snippet;

  Snippet.find({title: oneSnippet})
  .then(snippets => response.render('snippet', {snippets: snippets}))
  .catch(err => response.send('Booooooo'));
});


// GLOBAL SNIPPET SEARCHER ======================================

routes.post('/globalresults', function(request, response) {
  let search = request.body.search;

  Snippet.find({$or: [{title: search}, {body: search}, {optionalNotes: search}, {language: search}, {tags: search}, {createdBy: search}]})
  .then(snippets => response.render('searchSnippet', {snippets: snippets}))
  .catch(err => response.send('Booooooo'));
});


// USERS OWN SNIPPET SEARCHER ====================================

routes.post('/userresults', function(request, response) {
  let search = request.body.search;

  Snippet.find({createdBy: request.user.username, $or: [{'language': search}, {tags: search}]})
  .then(snippets => response.render('searchSnippet', {snippets: snippets}))
  .catch(err => response.send('Booooooo'));
});

module.exports = routes;
