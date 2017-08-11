const express = require('express');
const routes = express.Router();
const Snippet = require('../models/snippet');
const flash = require('express-flash-messages');
const bodyParser = require('body-parser');


// CREATE SNIPPET PAGE =================================
routes.get('/new', (request, response) => {
  response.render('createSnippet');
});

routes.post('/create', (request, response) => {
  let snippet = new Snippet(request.body);
  snippet.provider = 'local';

  snippet
    .save()
    // if good...
    .then(() => response.redirect('/'))
    // if bad...
    .catch(err => console.log(err));
});


module.exports = routes;
